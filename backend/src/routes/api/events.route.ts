import express from 'express'
import { Event } from '../../models';
import {
  getAllEvents,
  getCurrentEvent,
  getEventDetails,
  getLatestEvent,
} from '../../services/event.service';

const eventsRouter = express.Router();

eventsRouter.get('/', async (request, response, next) => {
  try {
    const events = await getAllEvents()
    response.status(200).json(events)
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.get('/:id', async (request, response, next) => {
  try {
    const eventDetails = await getEventDetails(request.params.id)
    if (!eventDetails) {
      response.status(404).end()
      return
    }
    response.status(200).json(eventDetails)
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.post('/', async (request, response, next) => {
  try {
    const event = request.body
    await Event.create(event)
    response.status(200).send('ok')
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.get('/current', async (request, response, next) => {
  try {
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(204).end()
      return
    }
    response.status(200).json(currentEvent)
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.get('/current', async (request, response, next) => {
  try {
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(204).end()
      return
    }
    response.status(200).json(currentEvent)
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.get('/latest', async (request, response, next) => {
  try {
    const latestEvent = await getLatestEvent()
    if (!latestEvent) {
      response.status(204).end()
      return
    }
    response.status(200).json(latestEvent)
  } catch (exception) {
    next(exception)
  }
})

export default eventsRouter

