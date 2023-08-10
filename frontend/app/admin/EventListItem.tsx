import React from "react"
import type { Event } from "../types"

interface EventListItemProps {
  event: Event
}

const EventListItem = ({ event }: EventListItemProps) => (
  <a href={`/events/${event['event_id']}`}>
    <div className="bg-white hover:bg-gray-300 shadow-md rounded px-8 py-4 mb-4">
      <h3 className="text-lg text-black font-semibold mb-2">{event['event_name']}</h3>
      <p className="text-gray-600 mb-2">
        Start Date: {new Date(event['start_date']).toLocaleString('fi')}
      </p>
      <p className="text-gray-600 mb-2">
        End Date: {new Date(event['end_date']).toLocaleString('fi')}
      </p>
    </div>
  </a>
)

export default EventListItem