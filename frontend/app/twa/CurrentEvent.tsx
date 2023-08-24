"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Leaderboard from "@/app/common/Leaderboards"
import type { EventWithLeaderboards } from "@/app/types"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const CurrentEvent = () => {
  const [ eventData, setEventData ] = useState<EventWithLeaderboards | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${baseUrl}/api/events/current`)
        .then(response => {
          setEventData(response.data)
          setErrorMessage('')
        })
        .catch(error => {
          setErrorMessage('Failed to load event data')
          console.log('Failed to fetch leaderboard data for event ', eventData?.event_id, error)
        })
    }, 1000)
    return () => clearInterval(interval)
  }, [ eventData?.event_id ])

  return (
    <main className='flex flex-col w-full min-h-screen mt-10 items-center'>
      {
        eventData?.leaderboards
          ? <Leaderboard data={eventData.leaderboards} />
          : <p>{errorMessage}</p>
      }
    </main>
  )
}

export default CurrentEvent