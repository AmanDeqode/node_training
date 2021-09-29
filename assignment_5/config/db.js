import Sequelize from 'sequelize';

export const db = new Sequelize('registeruser', 'postgres', 'deq@123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
  },
});
