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

// const SALT_WORK_FACTOR = 8;

// NEW DB METHOD TO CREATE NEW USER

db.newUser = (req, res, next) => {
  db.any('INSERT INTO users(id, username, password, city) VALUES (uuid_generate_v4(), $1, $2, $3);', [res.locals.username, res.locals.password, grabCityId])
  console.log('here');
  const user = req.body;
  const { password } = user;
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(password, salt);
  user.password = hash;
  insertNewUserPromise(user)
    .then(() => next())
    .catch(err => res.send(err));
};

module.exports = db;