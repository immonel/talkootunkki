import type { ParticipationCache, ParticipationWithParticipant } from "../types";

const participationStorageKey = 'participation'

export const toParticipationCache = (participation: ParticipationWithParticipant): ParticipationCache => ({
  participation_id: participation.participation_id,
  user_id: participation.user_id,
  event_id: participation.event_id,
  start_date: participation.start_date,
  end_date: participation.end_date,
  association: participation.association,
  username: participation.Participant.username,
  first_name: participation.Participant.first_name,
  last_name: participation.Participant.last_name,
  email: participation.Participant.email
})

export const storeParticipation = (participation: ParticipationWithParticipant) => {
  const cachedParticipation = toParticipationCache(participation)
  window.localStorage.setItem(participationStorageKey, JSON.stringify(cachedParticipation))
  return cachedParticipation
}
