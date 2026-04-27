import { useEffect, useState } from "react"
import axios from "axios"
import type { LeaderboardAssociation } from "@/src/types"
import Leaderboard from "../common/Leaderboards"
import { socket } from "@/src/utils/socket"

const CurrentEvent = () => {
  const [ leaderboards, setLeaderboards ] = useState<LeaderboardAssociation[] | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    let isMounted = true

    const setLeaderboardData = (data: LeaderboardAssociation[] | null | undefined) => {
      if (!isMounted) {
        return
      }
      if (!data) {
        setErrorMessage('Failed to load event data')
        return
      }
      setLeaderboards(data)
      setErrorMessage('')
    }

    axios.get<LeaderboardAssociation[]>('/api/events/latest/leaderboards')
      .then((response) => setLeaderboardData(response.data))
      .catch(() => setLeaderboardData(null))

    socket.on('CURRENT_EVENT', setLeaderboardData)
    socket.emit('CURRENT_EVENT')

    return () => {
      isMounted = false
      socket.off('CURRENT_EVENT', setLeaderboardData)
    }
  }, [])

  return (
    <main className='flex flex-col w-full min-h-screen items-center'>
      {
        leaderboards
          ? <Leaderboard data={leaderboards} />
          : <p>{errorMessage}</p>
      }
    </main>
  )
}

export default CurrentEvent
