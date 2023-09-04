import { socket } from "@/src/utils/socket"
import { useEffect, useState } from "react"

const Stats = () => {
  const [ clientCount, setClientCount ] = useState(NaN)

  useEffect(() => {
    socket.on('WS_CLIENT_COUNT', count => setClientCount(count))

    return () => {
      socket.off('WS_CLIENT_COUNT')
    }
  }, [])

  return (
    <p>WebSocket clients: {clientCount}</p>
  )
}

export default Stats