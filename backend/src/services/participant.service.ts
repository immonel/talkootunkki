import { Participant, Participation } from "../models";
import { UserData } from "../types";

type ParticipationInput = {
  association?: string | null;
  start_date?: number | string | null;
  end_date?: number | string | null;
}

export const saveOrUpdateParticipantToDb = async (userData: UserData) => {
  const {
    id,
    first_name,
    last_name,
    username,
    email
  } = userData

  return await Participant.upsert({
    user_id: id,
    first_name,
    last_name,
    username,
    email
  })
}
  
const getOpenParticipations = async (user_id: string, event_id: string) => {
  const openParticipations = await Participation.findAll({
    where: {
      user_id,
      event_id,
      end_date: null
    }
  })
  return openParticipations
}

/**
 * Returns a boolean value indicating whether participant has an open participation
 * a.k.a. "already joined" to the event and not finished
 *  */
export const hasOpenParticipation = async (user_id: string, event_id: string) => (
  (await getOpenParticipations(user_id, event_id)).length > 0
)

export const joinEvent = async (event_id: string, user_id: string, association?: string) => {
  const alreadyJoined = await hasOpenParticipation(user_id, event_id)
  if (alreadyJoined) {
    return
  }
  return await Participation.create({
    user_id,
    event_id,
    association,
  })
}

export const leaveEvent = async (event_id: string, user_id: string) => {
  return await Participation.update({ end_date: Date.now() }, {
    where: {
      event_id,
      user_id,
      end_date: null
    },
    returning: true
  })
}

export const deleteParticipation = async (participation_id: string) => {
  return await Participation.destroy({
    where: { participation_id }
  })
}

const parseDateInput = (value: number | string | undefined) => {
  if (value === undefined || value === '') {
    return undefined
  }
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) {
    throw Error('Invalid date')
  }
  return timestamp
}

const parseNullableDateInput = (value: number | string | null | undefined) => {
  if (value === null) {
    return null
  }
  return parseDateInput(value)
}

export const updateParticipation = async (participation_id: string, input: ParticipationInput) => {
  const participation = await Participation.findByPk(participation_id)
  if (!participation) {
    return null
  }

  if ('association' in input) {
    participation.association = input.association || null
  }

  if (input.start_date === null) {
    throw Error('Invalid date')
  }

  const startDate = parseDateInput(input.start_date)
  const endDate = parseNullableDateInput(input.end_date)

  if (startDate !== undefined) {
    participation.start_date = startDate
  }
  if (endDate !== undefined) {
    participation.end_date = endDate
  }

  await participation.save()

  return await Participation.findByPk(participation_id, {
    include: Participant
  })
}
