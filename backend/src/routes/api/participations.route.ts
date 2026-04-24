import express from 'express'
import { deleteParticipation, updateParticipation } from '../../services/participant.service';
import { uploadParticipationToSheets } from '../../services/google.service';
import { GoogleSheetsRow } from '../../types';

const participationsRouter = express.Router();

participationsRouter.patch('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const participation = await updateParticipation(id, request.body)
    if (!participation) {
      response.status(404).send(`Participation ID '${id}' not found`)
      return
    }

    uploadParticipationToSheets(participation.dataValues as GoogleSheetsRow)

    response.status(200).json(participation)
  } catch (exception) {
    if (exception instanceof Error && exception.message === 'Invalid date') {
      response.status(400).send(exception.message)
      return
    }
    next(exception)
  }
})

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
