import express from 'express'
import { getUserData } from '../../services/telegram.service';
import { validate } from '../../services/code.service';
import { hasOpenParticipation, saveOrUpdateParticipantToDb } from '../../services/participant.service';
import { getCurrentEvent, joinEvent, leaveEvent } from '../../services/event.service';

const registrationRouter = express.Router();

// TODO: rename to participant?
// TODO: tg auth to own middleware

registrationRouter.post('/', async (request, response, next) => {
  try {
    // Check user's one time code
    const code = request.body.code
    const codeIsValid = validate(code)
    if (!codeIsValid) {
      response.status(400).send('Invalid code')
      return
    }

    // Check integrity of telegram user data and get user data
    const userData = getUserData(request.body.initData)
    if (!userData) {
      response.status(400).send('Invalid user data')
      return
    }

    const [ user ] = await saveOrUpdateParticipantToDb(userData)
    console.log('Saved user to database')
    
    const currentEvent = await getCurrentEvent()
    if (!currentEvent) {
      response.status(400).send('No currently running event to join')
      return
    }
    const association: string | undefined = request.body.association || undefined
    const participation = await joinEvent(currentEvent.event_id, user.user_id, association)

    setTimeout(async () => {
      await leaveEvent(currentEvent.event_id, user.user_id)
    }, 3000)
    
    response.status(200).send('nauraa')
  } catch (exception) {
    next(exception)
  }
})

/**
 * Returns 200 and user data if user is "logged in" a.k.a. has an open participation
 * in a running event and 400 otherwise
 */
registrationRouter.post('/check', async (request, response, next) => {
  const userData = getUserData(request.body.initData)
  if (!userData) {
    response.status(400).end()
    return
  }
  const currentEvent = await getCurrentEvent()
  if (!currentEvent) {
    response.status(400).end()
    return
  }
  const loggedIn = await hasOpenParticipation(userData.id.toString(), currentEvent.event_id)
  if (!loggedIn) {
    response.status(400).end()
    return
  }
  response.status(200).json(userData)
})

export default registrationRouter