import { useEffect, useState } from "react";
import axios from "axios";
import { AdminEventData } from "@/src/types";
import Leaderboard from "@components/common/Leaderboards";
import ParticipationList from "./ParticipationList";
import { socket } from "@/src/utils/socket";
import { useNavigate } from "react-router-dom";

type EventProps = {
  event_id: string;
}

type EventInfoProps = {
  eventData: AdminEventData;
}

const EventInfo = ({ eventData }: EventInfoProps) => {
  const startDate = new Date(eventData.start_date).toLocaleString('fi')
  const endDate   = new Date(eventData.end_date).toLocaleString('fi')
  const participations = eventData.participations
  const totalParticipations = participations.length
  const currentlyParticipating = participations
    .filter(participation => participation.end_date === null)
    .length

  const navigate  = useNavigate()

  const handleDelete = () => {
    const id = eventData.event_id
    if (window.confirm('Are you sure?')) {
      axios.delete(`/api/events/${id}`)
        .then(() => navigate('/admin'))
        .catch(error => console.log('Failed to delete event', error))
    }
  }
  
  return (
    <div className="flex flex-col gap-10 w-10/12 items-center">
      <div className="flex flex-row w-full justify-between items-center">
        <div>
          <h2 className="text-2xl">{eventData.event_name}</h2>
          <p>{startDate} - {endDate}</p>
        </div>
        <div>
          <button
            onClick={handleDelete}
            className="rounded-xl p-3 bg-red-700 hover:bg-red-800"
          >
            Delete event
          </button>
        </div>
      </div>
      <div className="w-full">
        <p>Total participations: {totalParticipations}</p>
        <p>Currently participating: {currentlyParticipating}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 w-full">
        <Leaderboard data={eventData.leaderboards} />
        <ParticipationList participations={eventData.participations} />
      </div>
    </div>
  )
}

const AdminEventInfo = ({ event_id }: EventProps) => {
  const [ eventData, setEventData ] = useState<AdminEventData | null>(null)
  const [ errorMessage, setErrorMessage ] = useState('Loading event data...')

  useEffect(() => {
    axios.get(`/api/events/${event_id}`)
      .then(response => {
        setEventData(response.data)
        setErrorMessage('')
      })
      .catch(error => {
        setErrorMessage('Failed to load event data')
        console.log('Failed to fetch leaderboard data for event ', event_id, error)
      })

    socket.on('CURRENT_EVENT', (data) => {
      if (data?.event_id === event_id) {
        setEventData(data)
      }
    })

    return () => {
      socket.off('CURRENT_EVENT')
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

export default AdminEventInfo