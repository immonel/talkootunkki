import { Sequelize } from 'sequelize';

const PG_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const PG_USERNAME = process.env.POSTGRES_USER     || '';

export const sequelize = new Sequelize('talkoot', PG_USERNAME, PG_PASSWORD, {
    host:    'postgres',
    dialect: 'postgres'
  }
)