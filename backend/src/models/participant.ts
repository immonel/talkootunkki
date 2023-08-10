import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../services/db.service';

interface ParticipantModel extends Model<InferAttributes<ParticipantModel>, InferCreationAttributes<ParticipantModel>> {
  user_id:    string;
  username:   string | null;
  first_name: string;
  last_name:  string | null;
  email:      string | null;
}

const Participant = sequelize.define<ParticipantModel>('Participant', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING
  }
});

export default Participant;
