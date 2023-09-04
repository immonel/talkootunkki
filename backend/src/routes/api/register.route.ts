import express from 'express'
import { getUserData } from '../../services/telegram.service';
import { validate } from '../../services/code.service';
import { hasOpenParticipation, joinEvent, leaveEvent, saveOrUpdateParticipantToDb } from '../../services/participant.service';
import { getCurrentEvent, getCurrentEventAssociations } from '../../services/event.service';
import { GoogleSheetsRow, UserData } from '../../types';
import { uploadParticipationToSheets } from '../../services/google.service';

const registrationRouter = express.Router();

// TODO: rename to participant?
// TODO: tg auth to own middleware

registrationRouter.post('/', async (request, response, next) => {
  try {
    // Check user's one time code
    const code = request.body.code
    const codeIsValid = validate(code)
    if (!codeIsValid) {
      console.error('Invalid code entered', code)
      response.status(400).send('Invalid code')
      return
    }

    // Check integrity of telegram user data and get user data
    const userData: UserData | null = getUserData(request.body.initData)
    if (!userData) {
      console.error('Invalid user data', request.body.initData)
      response.status(400).send('Invalid user data')
      return
    }

    const { email } = request.body
    if (email) { // Do not overwrite old email with empty field
      userData.email = email
    }

    const [ user ] = await saveOrUpdateParticipantToDb(userData)
    console.log('Saved user to database', user.dataValues)
    
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(400).send('No currently running event to join')
      return
    }
    const association: string | undefined = request.body.association || undefined
    const participation = await joinEvent(currentEvent.event_id, user.user_id, association)
    
    // Upload the participation to sheets
    const googleSheetsRow: GoogleSheetsRow = {
      ...user?.dataValues,
      ...participation?.dataValues
    } as GoogleSheetsRow
    uploadParticipationToSheets(googleSheetsRow)
    
    response.status(200).json(userData)
  } catch (exception) {
    next(exception)
  }
})

/**
 * Returns 200 and user data if user is "logged in" a.k.a. has an open participation
 * in a running event and 400 otherwise
 */
registrationRouter.post('/check', async (request, response, next) => {
  try {
    const userData = getUserData(request.body.initData)
    if (!userData) {
      response.status(400).end()
      return
    }
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(400).end()
      return
    }
    const loggedIn = await hasOpenParticipation(userData.id.toString(), currentEvent.event_id)
    if (!loggedIn) {
      response.status(400).end()
      return
    }
    response.status(200).json(userData)
  } catch (exception) {
    next(exception)
  }
})

registrationRouter.post('/finish', async (request, response, next) => {
  try {
    const code = request.body.code
    const codeIsValid = validate(code)
    if (!codeIsValid) {
      console.error('Invalid code entered', code)
      response.status(400).send('Invalid code')
      return
    }

    const userData = getUserData(request.body.initData)
    if (!userData) {
      response.status(400).end('Invalid user data')
      return
    }
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(400).send('No event to finish')
      return
    }
    const [ affectedRowCount, affectedRows ] = await leaveEvent(currentEvent.event_id, userData.id.toString())
    
    // Upload the participation to sheets
    if (affectedRowCount) {
      const googleSheetsRow: GoogleSheetsRow = {
        ...affectedRows[0].dataValues
      } as GoogleSheetsRow
      uploadParticipationToSheets(googleSheetsRow)
    }
    console.log('Finished participation for user', userData.id)
      
    response.status(200).json(userData)
  } catch (exception) {
    next(exception)
  }
})

registrationRouter.get('/associations', async (request, response, next) => {
  try {
    const associations = await getCurrentEventAssociations()
    if (!associations.length) {
      response.status(204).end()
      return
    }
    response.status(200).json(associations)
  } catch (exception) {
    next(exception)
  }
})

export default registrationRouter