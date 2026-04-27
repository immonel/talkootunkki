import { ParticipationWithParticipant } from '@/src/types';
import { toTimeString } from '@/src/utils';
import axios from 'axios';
import { FormEvent, useState } from 'react';

type Props = {
  participations: ParticipationWithParticipant[];
  onParticipationChanged: () => void;
}

type ParticipationListItemProps = {
  participation: ParticipationWithParticipant;
  onParticipationChanged: () => void;
}

const deleteParticipation = (participation_id: string) => (
  axios.delete(`/api/participations/${participation_id}`)
    .then(() => console.log('Deleted participation', participation_id))
    .catch(error => console.log('Failed to delete participation', participation_id, error))
)

const sortByStartDate = (a: ParticipationWithParticipant, b: ParticipationWithParticipant) => (
  new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
)

const toDateTimeLocalValue = (date: string | null) => {
  if (!date) {
    return ''
  }
  const parsedDate = new Date(date)
  const offset = parsedDate.getTimezoneOffset() * 60000
  return new Date(parsedDate.getTime() - offset).toISOString().slice(0, 19)
}

const toTimestamp = (date: string) => {
  if (!date) {
    return null
  }
  return new Date(date).getTime()
}

const ParticipationListItem = ({ participation, onParticipationChanged }: ParticipationListItemProps) => {
  const { start_date, end_date, association, participation_id } = participation
  const { first_name, last_name, username, email } = participation.Participant
  const startDate = new Date(start_date)
  const endDate   = new Date(end_date || Date.now())
  const totalTime = endDate.getTime() - startDate.getTime()
  const running = !end_date
  const borderColor = running ? 'border-green-600' : 'border-gray-500'
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    association: association || '',
    start_date: toDateTimeLocalValue(start_date),
    end_date: toDateTimeLocalValue(end_date)
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      deleteParticipation(participation_id)
        .then(onParticipationChanged)
    }
  }

  const handleCancel = () => {
    setFormData({
      association: association || '',
      start_date: toDateTimeLocalValue(start_date),
      end_date: toDateTimeLocalValue(end_date)
    })
    setIsEditing(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setIsSaving(true)

    axios.patch(`/api/participations/${participation_id}`, {
      association: formData.association || null,
      start_date: toTimestamp(formData.start_date),
      end_date: toTimestamp(formData.end_date)
    })
      .then(() => {
        setIsEditing(false)
        onParticipationChanged()
      })
      .catch(error => console.log('Failed to update participation', participation_id, error))
      .finally(() => setIsSaving(false))
  }

  if (isEditing) {
    return (
      <li className="text-gray-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-3 py-3 md:flex-row md:items-end md:justify-between">
          <div className={`grid gap-3 border-l-4 pl-4 ${borderColor} sm:grid-cols-3`}>
            <label className="flex flex-col text-sm">
              Association
              <input
                value={formData.association}
                onChange={(event) => setFormData({ ...formData, association: event.target.value })}
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-sm">
              Start
              <input
                type="datetime-local"
                step="1"
                required
                value={formData.start_date}
                onChange={(event) => setFormData({ ...formData, start_date: event.target.value })}
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-sm">
              End
              <input
                type="datetime-local"
                step="1"
                value={formData.end_date}
                onChange={(event) => setFormData({ ...formData, end_date: event.target.value })}
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
            </label>
          </div>
          <div className="flex gap-3 self-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded bg-cs-orange px-3 py-2 text-sm text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="flex flex-row justify-between text-gray-900">
      <div className="px-3 py-3 flex items-center justify-between w-full">
        <div className={`flex flex-col border-l-4 pl-4 ${borderColor}`}>
          <span className="text-sm">{association || 'No association'}</span>
          <span className="text-sm text-gray-600">{first_name} {last_name}</span>
          <span className="text-sm text-gray-600">{username && `@${username}`}</span>
          <span className="text-sm text-gray-600">{email}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className='text-sm'>{toTimeString(totalTime, 'HHMMSS')}</span>
          <span className="text-sm text-gray-600">{startDate.toLocaleTimeString()} – {endDate.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="flex py-3 text-center">
        <button
          onClick={() => setIsEditing(true)}
          className="border-l border-gray-500 px-4"
        >
          <i className="bi-pencil text-xl text-gray-700" />
        </button>
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

const ParticipationList = ({ participations, onParticipationChanged }: Props) => (
  <div className="flex flex-col items-center w-10/12">
    <h2 className="text-2xl font-semibold mb-8">Participations</h2>
    <div className="w-full bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {participations.sort(sortByStartDate).map((participation) => (
          <ParticipationListItem
            key={participation.participation_id}
            participation={participation}
            onParticipationChanged={onParticipationChanged}
          />
        ))}
      </ul>
    </div>
  </div>
)

export default ParticipationList
