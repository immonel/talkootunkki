"use client"
import React, { useEffect, useState } from "react";
import type { AdminEventData } from "@/app/types";
import Leaderboards from "@/app/common/Leaderboards";
import axios from "axios";
import ParticipationList from "./ParticipationList";
import { adminSocket } from "@/app/utils/socket";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

type EventProps = {
  event_id: string;
}

type EventInfoProps = {
  eventData: AdminEventData;
}

const EventInfo = ({ eventData }: EventInfoProps) => {
  const startDate = new Date(eventData.start_date).toLocaleString('fi')
  const endDate   = new Date(eventData.end_date).toLocaleString('fi')
  
  return (
    <div className="flex flex-col gap-10 w-10/12 items-center">
      <div className="w-full">
        <h2 className="text-2xl">{eventData.event_name}</h2>
        <p>{startDate} - {endDate}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 w-full">
        <Leaderboards data={eventData.leaderboards} />
        <ParticipationList participations={eventData.participations} />
      </div>
    </div>
  )
}

const Event = ({ event_id }: EventProps) => {
  const [ eventData, setEventData ] = useState<AdminEventData | null>(null)
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

    adminSocket.on('CURRENT_EVENT', (data) => {
      if (data?.event_id === event_id) {
        setEventData(data)
      }
    })

    return () => {
      adminSocket.off('CURRENT_EVENT')
    }
  }, [ event_id ])

  return (
    <div className="flex flex-col w-full items-center">
      {eventData
        ? <EventInfo eventData={eventData} />
        : <p>{errorMessage}</p>
      }
    </div>
  )
}

export default Event