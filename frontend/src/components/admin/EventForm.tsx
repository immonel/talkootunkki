import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [telegramGroupLink, setTelegramGroupLink] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const event = {
      'event_name': eventName,
      'telegram_group_link': telegramGroupLink || null,
    }
    await axios.post('/api/events', event)
      .catch((error) => console.log('Error submitting event', error))
    navigate('/admin')
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
        <div className="flex items-center justify-between">
          <button
            className="bg-cs-orange hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
