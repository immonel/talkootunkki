import { Participant, Participation } from "../models";
import { TelegramUserData } from "../types";

export const saveOrUpdateParticipantToDb = async (userData: TelegramUserData) => {
  const {
    id,
    first_name,
    last_name,
    username
  } = userData

  return await Participant.upsert({
    user_id: id,
    first_name,
    last_name,
    username
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
    }
  })
}

export const deleteParticipation = async (participation_id: string) => {
  return await Participation.destroy({
    where: { participation_id }
  })
}