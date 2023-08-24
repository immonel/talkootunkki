import express from 'express'
import { deleteParticipation } from '../../services/event.service';

const participationsRouter = express.Router();

participationsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const rowsDeleted = await deleteParticipation(id)
    if (!rowsDeleted) {
      response.status(404).send(`Participation ID '${id}' not found`)
      return
    }
    console.log('Deleted participation', id)
    response.status(200).json({ participation_id: id })
  } catch (exception) {
    next(exception)
  }
})

export default participationsRouter