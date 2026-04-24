import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../services/db.service';

interface GoogleCredentialsModel extends Model<InferAttributes<GoogleCredentialsModel>, InferCreationAttributes<GoogleCredentialsModel>> {
  credentials_id: string;
  service_account_email: string;
  private_key: string;
}

const GoogleCredentials = sequelize.define<GoogleCredentialsModel>('GoogleCredentials', {
  credentials_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  service_account_email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  private_key: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

export default GoogleCredentials;
