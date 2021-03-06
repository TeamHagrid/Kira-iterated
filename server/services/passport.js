var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
var passport = require('passport');
const pgp = require('pg-promise')();
const db = require('../db');
// const { Pool } = require('pg');
// const pool = new Pool({ connectionString: process.env.SQL_URI });

// module.exports = function (db) {
passport.serializeUser((user, done) => {
  console.log('user: ', user)
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  // const queryText = 'select * from users where googleid = $1';

  // db.query(queryText, [id])
  //   .then(result => {
  //     // console.log('result: ', result)
  //     const user = result;
  //     done(null, user);
  //   });
  done(null, user);
});

// }

passport.use(new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.clientSecret,
  callbackURL: "/auth/google/callback"
},
  (accessToken, refreshToken, profile, cb) => {
    const googleid = profile.id;
    const username = profile.displayName;
    const id = 1234;

    const queryText = 'insert into users (id, username, googleid)' +
      'values (uuid_generate_v4(), $2, $3)' +
      // 'on conflict (googleid) do update set username=$2' +
      'returning *';

    db.query(queryText, [id, username, googleid])
      .then(result => {
        // console.log('result: ', result)
        const user = result;
        done(null, user);
      })
    return cb(null, { id: googleid });
  }
));

// module.exports = passport;