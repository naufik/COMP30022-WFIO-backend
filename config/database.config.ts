import * as Sequelize from 'sequelize';
import Credentials from '../.serverconfig/database';

const connection = new Sequelize(
  "wfio",
  Credentials.username,
  Credentials.password,
  {
    logging: false,
    dialect: "postgresql",
    host: Credentials.url,
    port: Credentials.port,
  }, // sequelize options
);

connection.authenticate().then(() => {
  console.log("[database] WFIO Database is Connected");
  if (Credentials.testEnvironment) {
    console.log("[database] Testbed mode is currently on, clearing all tables!");
  }

  connection.sync({
    force: Credentials.testEnvironment
  });
});

export default connection;