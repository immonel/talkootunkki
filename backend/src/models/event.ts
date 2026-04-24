import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../services/db.service';

interface EventModel extends Model<InferAttributes<EventModel>, InferCreationAttributes<EventModel>> {
  event_id:      CreationOptional<string>;
  event_name:    string;
  is_active:     CreationOptional<boolean>;
  telegram_group_link: CreationOptional<string | null>;
  google_sheet_id: CreationOptional<string | null>;
}

const Event = sequelize.define<EventModel>('Event', {
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  telegram_group_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  google_sheet_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  indexes: [{
    name: 'events_one_active_event',
    unique: true,
    fields: ['is_active'],
    where: {
      is_active: true
    }
  }]
})

export default Event;
