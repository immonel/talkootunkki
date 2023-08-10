import { Event, Participation } from "../models"
import { Op } from "sequelize"
import _ from 'lodash';
import { LeaderboardRow } from "../types";

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
  const associations = await Participation.findAll({
    attributes: ['association'],
    where: {
      event_id: event.event_id
    }
  })
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

export const joinEvent = async (event_id: string, user_id: string, association?: string) => {
  const openParticipations = await Participation.findAll({ where: {
    event_id,
    user_id,
    end_date: null
  }})
  if (openParticipations.length > 0) {
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
        association: key,
        totalTime: value
      })
      return result
    }, [] as LeaderboardRow[])

  return associations
}

export const getEventDetails = async (event_id: string) => {
  const event = await getEventById(event_id)
  if (!event) {
    return null
  }
  const leaderboards = await getLeaderboards(event_id)
  return {
    ...event.dataValues,
    leaderboards
  }
}