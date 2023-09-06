import { Event } from "@/src/types"
import { useNavigate } from "react-router-dom"

interface EventListItemProps {
  event: Event
}

const EventListItem = ({ event }: EventListItemProps) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/admin/event/${event['event_id']}`)}
      className="w-full text-start"
    >
      <div className="bg-white hover:bg-gray-300 shadow-md rounded px-8 py-4 mb-4">
        <h3 className="text-lg text-black font-semibold mb-2">{event['event_name']}</h3>
        <p className="text-gray-600 mb-2">
          Start Date: {new Date(event['start_date']).toLocaleString('fi')}
        </p>
        <p className="text-gray-600 mb-2">
          End Date: {new Date(event['end_date']).toLocaleString('fi')}
        </p>
      </div>
    </button>
  )
}

export default EventListItem