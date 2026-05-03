import express from 'express'
import {
  getCurrentEvent,
  getEventDetails,
  getLatestEvent,
} from '../../services/event.service'

const publicEventsRouter = express.Router()

publicEventsRouter.get('/current', async (request, response, next) => {
  try {
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(204).end()
      return
    }

    response.status(200).json({
      event_id: currentEvent.event_id,
      event_name: currentEvent.event_name,
      telegram_group_link: currentEvent.telegram_group_link
    })
  } catch (exception) {
    next(exception)
  }
})

publicEventsRouter.get('/latest/leaderboards', async (request, response, next) => {
  try {
    const latestEvent = await getLatestEvent()
    if (!latestEvent) {
      response.status(204).end()
      return
    }

    const eventDetails = await getEventDetails(latestEvent.event_id)
    if (!eventDetails) {
      response.status(204).end()
      return
    }

    response.status(200).json(eventDetails.leaderboards)
  } catch (exception) {
    next(exception)
  }
})

export default publicEventsRouter
