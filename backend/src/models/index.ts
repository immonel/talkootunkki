import Event from './event'
import GoogleCredentials from './googleCredentials'
import Participant from './participant'
import Participation from './participation'
import { sequelize } from '../services/db.service'

Participant.belongsToMany(Event, { through: {
  model: Participation,
  unique: false
}, foreignKey: 'user_id' })

Event.belongsToMany(Participant, { through: {
  model: Participation,
  unique: false
}, foreignKey: 'event_id' })


// Super Many-to-Many relationship, allows eager loading with join table
// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#the-best-of-both-worlds-the-super-many-to-many-relationship
Participant.hasMany(Participation, {
  foreignKey: 'user_id'
})
Participation.belongsTo(Participant, {
  foreignKey: 'user_id'
})
Event.hasMany(Participation, {
  foreignKey: 'event_id'
})
Participation.belongsTo(Event, {
  foreignKey: 'event_id'
})

const syncEventSchema = async () => {
  await Event.sync()

  await sequelize.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS `events_one_active_event` ON `Events` (`is_active`) WHERE `is_active` = 1'
  )
}

const syncParticipationSchema = async () => {
  await Participation.sync()
}

const syncModels = async () => {
  await syncEventSchema()
  await Participant.sync()
  await syncParticipationSchema()
  await GoogleCredentials.sync()
}

export const modelsReady = syncModels().catch((error) => {
  console.error('[sequelize] Failed to sync models:', error)
  throw error
})

export {
  Event,
  GoogleCredentials,
  Participant,
  Participation
}
