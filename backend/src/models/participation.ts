import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../services/db.service';
import Participant from './participant';
import Event from './event';

interface ParticipationModel extends Model<InferAttributes<ParticipationModel>, InferCreationAttributes<ParticipationModel>> {
  participation_id: CreationOptional<string>;
  user_id:          string;
  event_id:         string;
  start_date:       CreationOptional<number>;
  end_date:         number | null;
  association:      string | null;
}

const Participation = sequelize.define<ParticipationModel>('Participation', {
  participation_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Participant,
      key: 'user_id'
    }
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Event,
      key: 'event_id'
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  association: {
    type: DataTypes.STRING
  }
})

export default Participation;
