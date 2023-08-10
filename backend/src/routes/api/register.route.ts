import express from 'express'
import { getUserData } from '../../services/telegram.service';
import { validate } from '../../services/code.service';
import { saveOrUpdateParticipantToDb } from '../../services/participant.service';
import { getCurrentEvent, joinEvent, leaveEvent } from '../../services/event.service';

const registrationRouter = express.Router();

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
    const participation = await joinEvent(currentEvent.event_id, user.user_id)

    setTimeout(async () => {
      await leaveEvent(currentEvent.event_id, user.user_id)
    }, 3000)
    
    response.status(200).send('nauraa')
  } catch (exception) {
    next(exception)
  }
})

export default registrationRouter