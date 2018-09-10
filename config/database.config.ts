import * as Sequelize from 'sequelize';
import Credentials from '../.serverconfig/database';

const connection = new Sequelize(
  "wfio",
  Credentials.username,
  Credentials.password,
  {
    dialect: "postgresql",
    host: Credentials.url,
    port: Credentials.port,
  }, // sequelize options
);

connection.authenticate().then(() => {
  console.log("[[ Database Connected ]]");
  if (Credentials.testEnvironment) {
    console.log("[[ On Testbed Environment: Clearing All Databases ]]");
  }

  connection.sync({
    force: Credentials.testEnvironment
  });
});

export default connection;