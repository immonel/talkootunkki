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

Event.sync({
  // alter: true
})
Participant.sync({
  // alter: true
})
Participation.sync({
  // alter: true
})

export {
  Event,
  Participant,
  Participation
}