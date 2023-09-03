import { ParticipationWithParticipant } from '@/src/types';
import { toTimeString } from '@/src/utils';
import axios from 'axios';

type Props = {
  participations: ParticipationWithParticipant[];
}

type ParticipationListItemProps = {
  participation: ParticipationWithParticipant;
}

const deleteParticipation = (participation_id: string) => (
  axios.delete(`/api/participations/${participation_id}`)
    .then(() => console.log('Deleted participation', participation_id))
    .catch(error => console.log('Failed to delete participation', participation_id, error))
)

const sortByStartDate = (a: ParticipationWithParticipant, b: ParticipationWithParticipant) => (
  new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
)

const ParticipationListItem = ({ participation }: ParticipationListItemProps) => {
  const { start_date, end_date, association, participation_id } = participation
  const { first_name, last_name, username, email } = participation.Participant
  const startDate = new Date(start_date)
  const endDate   = new Date(end_date || Date.now())
  const totalTime = endDate.getTime() - startDate.getTime()
  const running = !end_date
  const borderColor = running ? 'border-green-600' : 'border-gray-500'

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      deleteParticipation(participation_id)
    }
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
          onClick={handleDelete}
          className="border-l border-gray-500 px-4"
        >
          <i className="bi-trash text-xl text-red-700" />
        </button>
      </div>
    </li>
  )
}

const ParticipationList = ({ participations }: Props) => (
  <div className="flex flex-col items-center w-10/12">
    <h2 className="text-2xl font-semibold mb-4">Participations</h2>
    <div className="w-full bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {participations.sort(sortByStartDate).map((participation, index) => (
          <ParticipationListItem key={index} participation={participation} />
        ))}
      </ul>
    </div>
  </div>
)

export default ParticipationList