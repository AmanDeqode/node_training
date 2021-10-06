import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const {
  NODE_ENV_DATABASE,
  NODE_ENV_USERNAME,
  NODE_ENV_PASSWORD,
  NODE_ENV_DIALECT,
  HOST,
} = process.env;

export const db = new Sequelize(
  NODE_ENV_DATABASE,
  NODE_ENV_USERNAME,
  NODE_ENV_PASSWORD,
  {
    host: HOST,
    dialect: NODE_ENV_DIALECT,
    logging: false,
    define: {
      timestamps: false,
    },
  }
);
