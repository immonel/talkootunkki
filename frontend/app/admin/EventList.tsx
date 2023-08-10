"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import EventListItem from "./EventListItem"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''

const EventList = () => {
  const [ events, setEvents ] = useState([])

  useEffect(() => {
    axios.get(`${baseUrl}/api/events`)
      .then((response) => setEvents(response.data))
      .catch((error) => console.log('Error loading events', error))
  }, [])

  return (
    <div className="w-full mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">All events</h2>
      {events.map((event, index) => (
        <EventListItem key={index} event={event} />
      ))}
    </div>
  )
}

export default EventList