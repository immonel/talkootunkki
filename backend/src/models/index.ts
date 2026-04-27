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
  await Event.sync({ alter: true })

  const [eventsTableRows] = await sequelize.query(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'Events'"
  )
  const eventsTableSql = (eventsTableRows as { sql: string }[])[0]?.sql || ''

  if (/\bis_active\b[^,]*\bUNIQUE\b/i.test(eventsTableSql)) {
    await sequelize.query('PRAGMA foreign_keys = OFF')
    try {
      await sequelize.transaction(async (transaction) => {
        await sequelize.query('DROP INDEX IF EXISTS events_one_active_event', { transaction })
        await sequelize.query('ALTER TABLE `Events` RENAME TO `Events_backup`', { transaction })
        await sequelize.query(
          'CREATE TABLE `Events` (`event_id` VARCHAR(255) NOT NULL PRIMARY KEY, `event_name` VARCHAR(255) NOT NULL, `is_active` TINYINT(1) NOT NULL DEFAULT 0, `telegram_group_link` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `google_sheet_id` VARCHAR(255))',
          { transaction }
        )
        await sequelize.query(
          'INSERT INTO `Events` (`event_id`, `event_name`, `is_active`, `telegram_group_link`, `createdAt`, `updatedAt`, `google_sheet_id`) SELECT `event_id`, `event_name`, `is_active`, `telegram_group_link`, `createdAt`, `updatedAt`, `google_sheet_id` FROM `Events_backup`',
          { transaction }
        )
        await sequelize.query('DROP TABLE `Events_backup`', { transaction })
      })
    } finally {
      await sequelize.query('PRAGMA foreign_keys = ON')
    }
  }

  await sequelize.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS `events_one_active_event` ON `Events` (`is_active`) WHERE `is_active` = 1'
  )
}

const syncParticipationSchema = async () => {
  await Participation.sync({
    // alter: true
  })

  const [participationsTableRows] = await sequelize.query(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'Participations'"
  )
  const participationsTableSql = (participationsTableRows as { sql: string }[])[0]?.sql || ''

  if (/\bEvents_backup\b/.test(participationsTableSql)) {
    await sequelize.query('PRAGMA foreign_keys = OFF')
    try {
      await sequelize.transaction(async (transaction) => {
        await sequelize.query('ALTER TABLE `Participations` RENAME TO `Participations_backup`', { transaction })
        await sequelize.query(
          'CREATE TABLE `Participations` (`participation_id` VARCHAR(255) NOT NULL PRIMARY KEY, `user_id` VARCHAR(255) NOT NULL REFERENCES `Participants` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, `event_id` VARCHAR(255) NOT NULL REFERENCES `Events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE, `start_date` DATETIME NOT NULL, `end_date` DATETIME DEFAULT NULL, `association` VARCHAR(32), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)',
          { transaction }
        )
        await sequelize.query(
          'INSERT INTO `Participations` (`participation_id`, `user_id`, `event_id`, `start_date`, `end_date`, `association`, `createdAt`, `updatedAt`) SELECT `participation_id`, `user_id`, `event_id`, `start_date`, `end_date`, `association`, `createdAt`, `updatedAt` FROM `Participations_backup`',
          { transaction }
        )
        await sequelize.query('DROP TABLE `Participations_backup`', { transaction })
      })
    } finally {
      await sequelize.query('PRAGMA foreign_keys = ON')
    }
  }
}

const syncModels = async () => {
  await syncEventSchema()
  await Participant.sync({
    // alter: true
  })
  await syncParticipationSchema()
  await GoogleCredentials.sync({
    alter: true
  })
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
