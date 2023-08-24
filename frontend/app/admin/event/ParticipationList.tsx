"use client"
import { Participant, Participation } from '@/app/types';
import { toTimeString } from '@/app/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

interface ParticipationWithParticipant extends Participation {
  Participant: Participant;
}

type Props = {
  event_id: string;
}

type ParticipationListItemProps = {
  participation: ParticipationWithParticipant;
}

const deleteParticipation = (participation_id: string) => (
  axios.delete(`${baseUrl}/api/participations/${participation_id}`)
    .then(ok => console.log('Deleted participation', participation_id))
    .catch(error => console.log('Failed to delete participation', participation_id, error))
)

const ParticipationListItem = ({ participation }: ParticipationListItemProps) => {
  const { start_date, end_date, association, participation_id } = participation
  const { first_name, last_name, username, email } = participation.Participant
  const startDate = new Date(start_date)
  const endDate   = new Date(end_date || Date.now())
  const totalTime = endDate.getTime() - startDate.getTime()

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      deleteParticipation(participation_id)
    }
  }

  return (
    <li className="flex flex-row justify-between text-gray-900">
      <div className="px-4 py-3 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-sm">{association || 'No association'}</span>
          <span className="text-sm text-gray-600">{first_name} {last_name}</span>
          <span className="text-sm text-gray-600">@{username}</span>
          <span className="text-sm text-gray-600">{email}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className='text-sm'>{toTimeString(totalTime, 'HHMMSS')}</span>
          <span className="text-sm text-gray-600">{startDate.toLocaleTimeString()} – {endDate.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="flex py-3 text-center">
        <button
          onClick={handleDelete}
          className="border-l border-gray-500 px-4"
        >
          <i className="bi-trash text-xl text-red-700" />
        </button>
      </div>
    </li>
  )
}

const ParticipationList = ({ event_id }: Props) => {
  const [ participations, setParticipations ] = useState<ParticipationWithParticipant[]>([])

  useEffect(() => {
    axios.get(`${baseUrl}/api/events/${event_id}/participations`)
      .then(response => setParticipations(response.data.reverse()))
      .catch(error => console.log('Failed to load participations', error))
  }, [ event_id ])

  return (
    <div className="flex flex-col items-center w-10/12">
      <h2 className="text-2xl font-semibold mb-4">Participations</h2>
      <div className="w-full bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {participations.map((participation, index) => (
            <ParticipationListItem key={index} participation={participation} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ParticipationList