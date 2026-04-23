import { Event, Participant, Participation } from "../models"
import _ from 'lodash';
import { LeaderboardAssociation } from "../types";
import { sequelize } from "./db.service";

type EventInput = {
  event_name: string;
  telegram_group_link?: string | null;
}

export const getAllEvents = async () => await Event.findAll({
  order: [
    ['createdAt', 'DESC']
  ]
})

const getEventById = async (id: string) => (
  await Event.findOne({
    where: {
      event_id: id
    }
  })
)

export const deleteEventById = async (id: string) => (
  await Event.destroy({
    where: {
      event_id: id
    }
  })
)

export const createEvent = async (event: EventInput) => sequelize.transaction(async (transaction) => {
  await Event.update(
    { is_active: false },
    {
      where: { is_active: true },
      transaction
    }
  )
  return Event.create(
    {
      ...event,
      is_active: true
    },
    { transaction }
  )
})

export const setEventActive = async (id: string, is_active: boolean) => sequelize.transaction(async (transaction) => {
  const event = await Event.findOne({
    where: { event_id: id },
    transaction
  })
  if (!event) {
    return null
  }

  if (is_active) {
    await Event.update(
      { is_active: false },
      {
        where: { is_active: true },
        transaction
      }
    )
  }

  event.is_active = is_active
  return event.save({ transaction })
})

export const getCurrentEvent = async () => {
  const currentEvent = await Event.findOne({
    where: { is_active: true }
  })
  return currentEvent
}

export const getCurrentEventAssociations = async () => {
  const event = await getCurrentEvent()
  if (!event) {
    return []
  }
  const associations = (await Participation.findAll({
    attributes: ['association'],
    where: {
      event_id: event.event_id
    },
    group: ['association']
  }))
    // Extract from objects
    .map(x => x.association)
    // Filter out empty entries
    .filter(x => x) 
  return associations
}

export const getLatestEvent = async () => {
  const latestEvent = await Event.findOne({
    order: [
      ['createdAt', 'DESC']
    ]
  })
  return latestEvent
}

/**
 * Returns total accumulated cleaning time by associations in milliseconds
 */
const getLeaderboards = async (event_id: string) => {
  const participations = await Participation.findAll({
    attributes: ['association', 'start_date', 'end_date', 'user_id'],
    where: { event_id }
  })
  const associations = _(participations)
    // Group participations by association
    .groupBy(participation => participation.association)
    // Accumulate total participation time by association
    .mapValues(participations => (
      participations.reduce((totalTime, participation) => {
        const { start_date, end_date } = participation
        const participationDuration = (end_date || Date.now()) - start_date
        return totalTime + participationDuration
      }, 0)
    ))
    // Wrangle to an array
    .reduce((result, value, key) => {
      result.push({
        name: key,
        totalTime: value
      })
      return result
    }, [] as LeaderboardAssociation[])
    // Filter out null values
    .filter(association => association.name !== 'null')

  return associations
}

const getParticipations = async (event_id: string) => {
  const participations = await Participation.findAll({
    where: { event_id },
    include: Participant
  })
  return participations
}

export const getEventDetails = async (event_id: string) => {
  const event = await getEventById(event_id)
  if (!event) {
    return null
  }
  const leaderboards = await getLeaderboards(event_id)
  const participations = await getParticipations(event_id)
  return {
    ...event.dataValues,
    leaderboards,
    participations
  }
}
