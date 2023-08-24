"use client"
import React, { useEffect, useState } from "react"
import Leaderboard from "@/app/common/Leaderboards"
import type { LeaderboardAssociation } from "@/app/types"
import { otherSocket } from "../utils/socket"

const CurrentEvent = () => {
  const [ leaderboards, setLeaderboards ] = useState<LeaderboardAssociation[] | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    otherSocket.on('CURRENT_EVENT', (data) => {
      if (!data) {
        setErrorMessage('Failed to load event data')
        return
      }
      setLeaderboards(data)
      setErrorMessage('')
    })
    otherSocket.emit('CURRENT_EVENT')

    return () => {
      otherSocket.off('CURRENT_EVENT')
    }
  }, [])

  return (
    <main className='flex flex-col w-full min-h-screen mt-10 items-center'>
      {
        leaderboards
          ? <Leaderboard data={leaderboards} />
          : <p>{errorMessage}</p>
      }
    </main>
  )
}

export default CurrentEvent