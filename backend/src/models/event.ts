import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../services/db.service';

interface EventModel extends Model<InferAttributes<EventModel>, InferCreationAttributes<EventModel>> {
  event_id:      CreationOptional<string>;
  event_name:    string;
  start_date:    number;
  end_date:      number;
  telegram_group_link: CreationOptional<string | null>;
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
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  telegram_group_link: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

export default Event;
