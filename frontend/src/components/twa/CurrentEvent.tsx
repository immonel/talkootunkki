import { useEffect, useState } from "react"
import type { LeaderboardAssociation } from "@/src/types"
import Leaderboard from "../common/Leaderboards"
import { socket } from "@/src/utils/socket"

const CurrentEvent = () => {
  const [ leaderboards, setLeaderboards ] = useState<LeaderboardAssociation[] | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    socket.on('CURRENT_EVENT', (data) => {
      if (!data) {
        setErrorMessage('Failed to load event data')
        return
      }
      setLeaderboards(data)
      setErrorMessage('')
    })
    socket.emit('CURRENT_EVENT')

    return () => {
      socket.off('CURRENT_EVENT')
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