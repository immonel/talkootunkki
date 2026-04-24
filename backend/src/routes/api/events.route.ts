import express from 'express'
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getCurrentEvent,
  getEventDetails,
  getLatestEvent,
  setEventActive,
} from '../../services/event.service';
import { GoogleSheetsAccessError } from '../../services/google.service';

const eventsRouter = express.Router();

eventsRouter.get('/', async (request, response, next) => {
  try {
    const events = await getAllEvents()
    response.status(200).json(events)
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
    const eventDetails = await getEventDetails(currentEvent.event_id)
    response.status(200).json(eventDetails)
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

eventsRouter.delete('/:id', async (request, response, next) => {
  try {
    const event_id = request.params.id
    const rowsDeleted = await deleteEventById(event_id)
    if (!rowsDeleted) {
      response.status(404).end()
      return
    }
    response.status(200).json({ event_id })
  } catch (exception) {
    next(exception)
  }
})

eventsRouter.post('/', async (request, response, next) => {
  try {
    const event = request.body
    await createEvent(event)
    response.status(200).send('ok')
  } catch (exception) {
    if (exception instanceof GoogleSheetsAccessError) {
      response.status(400).json({
        code: 'GOOGLE_SHEETS_ACCESS_FAILED',
        message: exception.message
      })
      return
    }
    if (
      exception instanceof Error &&
      ['Google Sheets link is required', 'Invalid Google Sheets link'].includes(exception.message)
    ) {
      response.status(400).json({
        code: 'GOOGLE_SHEETS_LINK_INVALID',
        message: exception.message
      })
      return
    }
    next(exception)
  }
})

eventsRouter.patch('/:id/active', async (request, response, next) => {
  try {
    const event = await setEventActive(request.params.id, request.body.is_active === true)
    if (!event) {
      response.status(404).end()
      return
    }
    response.status(200).json(event)
  } catch (exception) {
    next(exception)
  }
})

export default eventsRouter
