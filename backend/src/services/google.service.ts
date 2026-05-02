import crypto from 'crypto';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'
import { Event, GoogleCredentials } from '../models';
import { GoogleSheetsRow } from '../types';

const credentialsId = 'default'
const algorithm = 'aes-256-gcm'
const sheetTitle = 'talkootunkki'
const headerValues = [
  'first_name',
  'last_name',
  'username',
  'email',
  'association',
  'start_date',
  'end_date',
  'participation_duration',
  'participation_id'
]

type GoogleServiceAccountCredentials = {
  service_account_email: string;
  private_key: string;
}

export class GoogleSheetsAccessError extends Error {
  constructor(message = 'Google Sheets access failed') {
    super(message)
    this.name = 'GoogleSheetsAccessError'
  }
}

const getEncryptionKey = () => {
  if (!process.env.APP_SECRET_KEY) {
    throw Error('APP_SECRET_KEY environment variable not set!')
  }
  return crypto.createHash('sha256').update(process.env.APP_SECRET_KEY).digest()
}

const encrypt = (value: string) => {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`
}

const decrypt = (value: string) => {
  const [iv, authTag, encrypted] = value.split(':')
  if (!iv || !authTag || !encrypted) {
    throw Error('Invalid encrypted Google credentials')
  }
  const decipher = crypto.createDecipheriv(
    algorithm,
    getEncryptionKey(),
    Buffer.from(iv, 'base64')
  )
  decipher.setAuthTag(Buffer.from(authTag, 'base64'))
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64')),
    decipher.final()
  ]).toString('utf8')
}

export const parseGoogleSheetId = (sheetLinkOrId: string | null | undefined) => {
  const value = sheetLinkOrId?.trim()
  if (!value) {
    return null
  }

  const sheetUrlMatch = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (sheetUrlMatch?.[1]) {
    return sheetUrlMatch[1]
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(value)) {
    return value
  }

  return null
}

const normalizePrivateKey = (privateKey: string) => (
  privateKey.replace(/\\n/g, '\n').trim()
)

export const getGoogleCredentials = async () => {
  const storedCredentials = await GoogleCredentials.findByPk(credentialsId)
  if (!storedCredentials) {
    return null
  }

  return {
    service_account_email: decrypt(storedCredentials.service_account_email),
    private_key: decrypt(storedCredentials.private_key)
  }
}

export const saveGoogleCredentials = async (credentials: GoogleServiceAccountCredentials) => {
  await GoogleCredentials.upsert({
    credentials_id: credentialsId,
    service_account_email: encrypt(credentials.service_account_email.trim()),
    private_key: encrypt(normalizePrivateKey(credentials.private_key))
  })
}

const getDoc = (sheetId: string, credentials: GoogleServiceAccountCredentials) => {
  const serviceAccountAuth = new JWT({
    email: credentials.service_account_email,
    key: normalizePrivateKey(credentials.private_key),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  return new GoogleSpreadsheet(sheetId, serviceAccountAuth);
}

export const validateGoogleSheetsAccess = async (
  sheetId: string,
  credentials?: GoogleServiceAccountCredentials | null
) => {
  const googleCredentials = credentials || await getGoogleCredentials()
  if (!googleCredentials) {
    throw new GoogleSheetsAccessError('Google service account credentials missing')
  }

  try {
    const doc = getDoc(sheetId, googleCredentials)
    await initializeSheet(doc)
  } catch (error) {
    throw new GoogleSheetsAccessError()
  }
}

type GoogleSheetsRowSource = {
  dataValues?: Record<string, unknown>;
  Participant?: GoogleSheetsRowSource;
} & Record<string, unknown>

export const toGoogleSheetsRow = (source: { dataValues?: Record<string, unknown> }) => {
  const participationValues = source.dataValues || source
  const participant = (
    (source as GoogleSheetsRowSource).Participant ||
    (participationValues as GoogleSheetsRowSource).Participant
  ) as GoogleSheetsRowSource | undefined
  const participantValues = participant?.dataValues || participant || {}
  const { Participant, ...flatParticipationValues } = participationValues as GoogleSheetsRowSource

  return {
    ...participantValues,
    ...flatParticipationValues
  } as unknown as GoogleSheetsRow
}

const initializeSheet = async (doc: GoogleSpreadsheet) => {
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle[sheetTitle]
  if (!sheet) {
    console.error('Error loading sheet, creating a new one')
    await doc.addSheet({
      title: sheetTitle,
      headerValues
    })
    return
  }

  await sheet.setHeaderRow(headerValues)
}

export const uploadParticipationToSheets = async (participation: GoogleSheetsRow) => {
  if (!participation.event_id) return

  const event = await Event.findByPk(participation.event_id)
  if (!event?.google_sheet_id) return

  const googleCredentials = await getGoogleCredentials()
  if (!googleCredentials) {
    console.error('Google credentials not configured. Participation will not be uploaded to Google Sheets')
    return
  }

  try {
    const doc = getDoc(event.google_sheet_id, googleCredentials)

    // Google sheets does not understand ISO 8601 timestamps
    const start_date = parseTimestamp(participation.start_date)
    const end_date   = parseTimestamp(participation.end_date)
    const participation_duration = formatDuration(participation.start_date, participation.end_date)
    const rowValues  = {
      ...participation,
      participation_duration,
      ...(start_date) && { start_date },
      ...(end_date)   && { end_date }
    }

    await initializeSheet(doc)
    const sheet = doc.sheetsByTitle[sheetTitle]
    const rows = await sheet.getRows()
    const row = rows?.find(row => (
      row.get('participation_id') === participation.participation_id)
    )
    if (row) {
      row.assign(rowValues)
      await row.save()
    } else {
      await sheet.addRow(rowValues)
    }
    console.log('Uploaded participation to Google Sheets')
  } catch (error) {
    console.error('Failed to upload participation to Google Sheets', error, participation)
  }
}

const parseTimestamp = (timestamp: number | undefined) => {
  if (timestamp) {
    return new Date(timestamp).getTime()
  } else {
    return undefined
  }
}

const formatDuration = (startTimestamp: number | undefined, endTimestamp: number | undefined) => {
  if (!startTimestamp || !endTimestamp || endTimestamp < startTimestamp) {
    return ''
  }

  const durationMinutes = Math.floor((endTimestamp - startTimestamp) / (1000 * 60))
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
