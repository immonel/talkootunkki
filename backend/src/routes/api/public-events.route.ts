import express from 'express'
import {
  getEventDetails,
  getLatestEvent,
} from '../../services/event.service'

const publicEventsRouter = express.Router()

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
