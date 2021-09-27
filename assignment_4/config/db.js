import Sequelize from 'sequelize';

export const db = new Sequelize('database_1', 'postgres', 'deq@123', {
  host: 'localhost',
  dialect: 'postgres',
});
