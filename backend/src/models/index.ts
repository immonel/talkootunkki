import Event from './event'
import Participant from './participant'
import Participation from './participation'

Participant.belongsToMany(Event, { through: {
  model: Participation,
  unique: false
}, foreignKey: 'user_id' })

Event.belongsToMany(Participant, { through: {
  model: Participation,
  unique: false
}, foreignKey: 'event_id' })

Event.sync({ alter: true })
Participant.sync({ alter: true })
Participation.sync({ alter: true })

export {
  Event,
  Participant,
  Participation
}