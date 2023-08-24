import { Event, Participant, Participation } from "../models"
import { Op } from "sequelize"
import _ from 'lodash';
import { LeaderboardAssociation } from "../types";

export const getAllEvents = async () => await Event.findAll()

const getEventById = async (id: string) => (
  await Event.findOne({
    where: {
      event_id: id
    }
  })
)

export const getCurrentEvent = async () => {
  const currentDate = Date.now()
  const currentEvent = await Event.findOne({
    where: {
      [Op.and]: [{
        start_date: {
          [Op.lte]: currentDate
        }
      }, {
        end_date: {
          [Op.gt]: currentDate
        }
      }]
    }
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
      ['start_date', 'DESC']
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