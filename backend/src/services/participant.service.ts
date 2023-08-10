import { Participant } from "../models";
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