import { socket } from "@/src/utils/socket"
import { useEffect, useState } from "react"

type ClientCount = {
  admin: number;
  other: number;
}

const Stats = () => {
  const [ clientCount, setClientCount ] = useState<ClientCount>({
    admin: NaN,
    other: NaN
  })

  useEffect(() => {
    socket.on('WS_CLIENT_COUNT', counts => setClientCount(counts))
    socket.emit('WS_CLIENT_COUNT')

    return () => {
      socket.off('WS_CLIENT_COUNT')
    }
  }, [])

  return (
    <div>
      <ul className="p-3 bg-white rounded-lg shadow text-black">
        <p>WebSocket clients</p>
        <li className="text-sm">Admin: {clientCount.admin}</li>
        <li className="text-sm">Other: {clientCount.other}</li>
      </ul>
    </div>
  )
}

export default Stats