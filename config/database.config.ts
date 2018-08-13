import * as Sequelize from 'sequelize';

const connection = new Sequelize(
  "insert database url here",
  "the username here",
  "the password here",
  {},
);

export default connection;