import * as Sequelize from 'sequelize';
import Credentials from '../.serverconfig/database';

const connection = new Sequelize(
  Credentials.url,
  Credentials.username,
  Credentials.password,
  {}, // sequelize options
);

export default connection;