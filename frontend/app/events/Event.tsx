"use client"
import React, { useEffect, useState } from "react";
import Leaderboards, { LeaderboardDataRow } from "./Leaderboards";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

type EventProps = {
  event_id: string;
}

type EventData = {
  event_id: string;
  event_name: string;
  start_date: string;
  end_date: string;
  leaderboards: LeaderboardDataRow[];
}

const Event = ({ event_id }: EventProps) => {
  const [ eventData, setEventData ] = useState<EventData | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    axios.get(`${baseUrl}/api/events/${event_id}`)
      .then(response => {
        setEventData(response.data)
        setErrorMessage('')
      })
      .catch(error => {
        setErrorMessage('Failed to load event data')
        console.log('Failed to fetch leaderboard data for event ', event_id, error)
      })
  }, [ event_id ])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {eventData
        ? <Leaderboards data={eventData.leaderboards} />
        : <p>{errorMessage}</p>
      }
    </div>
  )
}

export default Event