require('dotenv').config();
// checking connection of the database 
const initOptions = {
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('Connected to database' + cp.database)
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    console.log('Disconnected from database' + cp.database)
  },
  query(e) {
    console.log('QUERY:' + e.query)
  },
  receive(data, result, e) {
    console.log('DATA' + data)
  }
}
const pgp = require('pg-promise')(initOptions);
const db = pgp(process.env.SQL_URI);

module.exports = db;