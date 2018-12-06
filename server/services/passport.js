var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
var passport = require('passport');
const pgp = require('pg-promise')();
const db = require('../db');

module.exports = function (db) {
  passport.serializeUser((user, done) => {
    done(null, user.googleid);
  });

  passport.deserializeUser((googleid, done) => {
    const queryText = 'select * from users where googleid = $1';

    db.query(queryText, [googleid])
      .then(result => {
        const user = result.rows[0];
        done(null, user);
      });
  });

}

passport.use(new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.clientSecret,
  callbackURL: "/auth/google/callback"
},
  (accessToken, refreshToken, profile, done) => {
    const googleid = profile.id;
    const username = profile.displayName;
    const id = 1234;

    const queryText = 'insert into users (id, username, googleid)' +
      'values (uuid_generate_v4(), $2, $3)' +
      // 'on conflict (googleid) do update set username=$2' +
      'returning *';

    db.query(queryText, [id, username, googleid])
      .then(result => {
        const user = result.rows[0];
        done(null, user);
      })

    // TODO: use pg promise, db.one to find out if user already exists in db with googleid --> see Mongoose Queries section

    // db.any('INSERT INTO users(id, username, googleid) VALUES (uuid_generate_v4(), $1, $2);', [profile.displayName, profile.id])
    //   .then(user => {
    //     done(null, user);
    //     // console.log('data: ', data)
    //   })
    //   .catch(err => console.log(err))
  }
));

// module.exports = passport;