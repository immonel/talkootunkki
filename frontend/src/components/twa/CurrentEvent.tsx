import { useEffect, useState } from "react"
import type { LeaderboardAssociation } from "@/src/types"
import Leaderboard from "../common/Leaderboards"
import { otherSocket } from "@/src/utils/socket"

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