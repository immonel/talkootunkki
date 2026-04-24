import axios, { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [telegramGroupLink, setTelegramGroupLink] = useState('');
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [googleServiceAccountEmail, setGoogleServiceAccountEmail] = useState('');
  const [googlePrivateKey, setGooglePrivateKey] = useState('');
  const [showGoogleCredentials, setShowGoogleCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)
    const event = {
      'event_name': eventName,
      'telegram_group_link': telegramGroupLink || null,
      'google_sheet_link': googleSheetLink || null,
      ...(showGoogleCredentials && {
        'google_service_account_email': googleServiceAccountEmail,
        'google_private_key': googlePrivateKey,
      })
    }
    try {
      await axios.post('/api/events', event)
      navigate('/admin')
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
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
