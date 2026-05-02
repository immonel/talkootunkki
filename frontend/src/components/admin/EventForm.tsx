import axios, { AxiosError } from 'axios';
import { Event } from '@/src/types';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type EventFormProps = {
  event?: Event;
  onSaved?: (event: Event) => void;
}

const EventForm = ({ event, onSaved }: EventFormProps) => {
  const [eventName, setEventName] = useState(event?.event_name || '');
  const [telegramGroupLink, setTelegramGroupLink] = useState(event?.telegram_group_link || '');
  const [googleSheetLink, setGoogleSheetLink] = useState(event?.google_sheet_id || '');
  const [googleServiceAccountEmail, setGoogleServiceAccountEmail] = useState('');
  const [googlePrivateKey, setGooglePrivateKey] = useState('');
  const [showGoogleCredentials, setShowGoogleCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()
  const isEditing = Boolean(event)

  useEffect(() => {
    setEventName(event?.event_name || '')
    setTelegramGroupLink(event?.telegram_group_link || '')
    setGoogleSheetLink(event?.google_sheet_id || '')
    setGoogleServiceAccountEmail('')
    setGooglePrivateKey('')
    setShowGoogleCredentials(false)
    setErrorMessage('')
  }, [event?.event_id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)
    const eventPayload = {
      'event_name': eventName,
      'telegram_group_link': telegramGroupLink || null,
      'google_sheet_link': googleSheetLink || null,
      ...(showGoogleCredentials && {
        'google_service_account_email': googleServiceAccountEmail,
        'google_private_key': googlePrivateKey,
      })
    }
    try {
      const response = isEditing
        ? await axios.patch(`/api/events/${event?.event_id}`, eventPayload)
        : await axios.post('/api/events', eventPayload)
      if (onSaved) {
        onSaved(response.data)
      } else {
        navigate('/admin')
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ code?: string; message?: string }>
      if (axiosError.response?.data?.code === 'GOOGLE_SHEETS_ACCESS_FAILED') {
        setShowGoogleCredentials(true)
        setErrorMessage('Google Sheets access failed. Add service account credentials and make sure the sheet is shared with that service account email.')
      } else if (axiosError.response?.data?.code === 'GOOGLE_SHEETS_LINK_INVALID') {
        setErrorMessage(axiosError.response.data.message || 'Invalid Google Sheets link')
      } else {
        setErrorMessage('Error submitting event')
        console.log('Error submitting event', error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="event-name">
            Event Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event-name"
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telegram-link">
            Telegram Group Link
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="telegram-link"
            type="url"
            placeholder="https://t.me/..."
            value={telegramGroupLink}
            onChange={(e) => setTelegramGroupLink(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="google-sheet-link">
            Google Sheet Link
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="google-sheet-link"
            type="text"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={googleSheetLink}
            onChange={(e) => setGoogleSheetLink(e.target.value)}
            required
          />
        </div>
        {isEditing && !showGoogleCredentials && (
          <div className="mb-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="google-service-account-email-redacted">
                Service Account Email
                <input
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  id="google-service-account-email-redacted"
                  type="text"
                  value={event?.google_service_account_email || ''}
                  readOnly
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold" htmlFor="google-private-key-redacted">
                Private Key
                <input
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  id="google-private-key-redacted"
                  type="text"
                  value="••••••••"
                  readOnly
                />
              </label>
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowGoogleCredentials(true)}
              >
                Update credentials
              </button>
            </div>
          </div>
        )}
        {showGoogleCredentials && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="google-service-account-email">
                Service Account Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="google-service-account-email"
                type="email"
                value={googleServiceAccountEmail}
                onChange={(e) => setGoogleServiceAccountEmail(e.target.value)}
                required={showGoogleCredentials}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="google-private-key">
                Private Key
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="google-private-key"
                rows={6}
                value={googlePrivateKey}
                onChange={(e) => setGooglePrivateKey(e.target.value)}
                required={showGoogleCredentials}
              />
            </div>
          </>
        )}
        {errorMessage && (
          <p className="text-red-700 mb-4">{errorMessage}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-cs-orange hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : isEditing ? 'Save' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
