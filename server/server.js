// necessary requirements to use express
require('dotenv').config();
const express = require('express');
const app = express();

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.SQL_URI });

const cors = require('cors')
// requirements for using geoip library

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, converted to milliseconds
    keys: [process.env.cookieKey] // encryption for cookie
  })
);

app.use(passport.initialize());
app.use(passport.session());

// require('./passport')(pool);
require('./authRoutes')(app);

const GeoIP = require('simple-geoip');

const geoip = new GeoIP(process.env.geoipkey);

const db = require('./db.js');
require('./services/passport');

const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../../dist'));


// automatically call getIpAddress and grabLocation
app.use(getIpAddress, grabLocation, grabCityId)

// function that is grabbing and saving the ip address
function getIpAddress(req, res, next) {
  // Middleware that grabs IP address of the client; should be able to be
  // done based on requests but have not done yet; set to Los Angeles
  const ipaddress = '74.87.214.86';
  // Throw an error if there is an issue with the ipaddress
  if (!ipaddress) { return res.send('Cannot get ipaddress') }
  // Save the ipaddress into res.locals
  res.locals.ipaddress = ipaddress;
  next();
}

// from the ipAddress; store state, city, latitude, and longitude
function grabLocation(req, res, next) {
  res.locals.state = "California";
  res.locals.city = "Los Angeles";
  res.locals.latitude = "34.0522";
  res.locals.longitude = "118.2437";
  return next();
  geoip.lookup('74.87.214.86', (err, data) => {
    if (err) throw err;
    else {
      res.locals.state = data.location.region;
      res.locals.city = data.location.city;
      res.locals.latitude = data.location.lat;
      res.locals.longitude = data.location.lng;
    }
  });
}
// function grabLocation(req, res, next) {
//   geoip.lookup('74.87.214.86', (err, data) => {
//     if (err) throw err;
//     else {
//       res.locals.state = data.location.region;
//       res.locals.city = data.location.city;
//       res.locals.latitude = data.location.lat;
//       res.locals.longitude = data.location.lng;
//       return next();
//     }
//   });
// }

// store id into locals after username and password is submitted
function grabUserId(req, res, next) {
  db.any('SELECT id FROM users WHERE (username = $1 AND password = $2)', [req.body.username, req.body.password])
    .then((data) => {
      res.locals.userid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find user in database');
      return res.sendStatus(500);
    });
}

//TODO: validate that user is a user in database
// function grabGoogleId(req, res, next) {
//   db.any('SELECT googleid FROM users WHERE (googleid = $1)', [req.body.googleid])
//     .then((data) => {
//       res.locals.googleid = data[0].googleid;
//       next();
//     })
//     .catch((err) => {
//       console.error('Cannot find user in database');
//       return res.sendStatus(500);
//     });
// }

//grabs the city ID and store into local
function grabCityId(req, res, next) {
  db.any('SELECT id FROM city WHERE (name = $1 AND state = $2)', [res.locals.city, res.locals.state])
    .then((data) => {
      res.locals.cityid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find city in database');
      return res.sendStatus(500);
    })
}

// this updates the city ID for users whenever they log in;
function updateCityId(req, res, next) {
  db.any('UPDATE users SET city = $1 WHERE id = $2', [res.locals.cityid, res.locals.userid])
    .then((data) => {
      console.log('Successfully updated city ID');
      next();
    })
    .catch((err) => {
      console.error('Error updating city for user');
      return res.sendStatus(500)
    })
}

// middleware for grabbing the pictures from the database
function grabPics(req, res, next) {
  console.log(res.locals.cityid)
  db.any('SELECT id, picture_url, userid, likes, description, style_nightlife, style_outdoor FROM pictures WHERE city = $1', [res.locals.cityid])
    .then((data) => {
      let returnData = {};
      returnData = data.reduce((accum, el) => {
        let id = el.id;
        accum[id] = {
          'picture_url': el.picture_url,
          'userid': el.userid,
          'likes': el.likes,
          'description': el.description,
          'style_nightlife': el.style_nightlife,
          'style_outdoor': el.style_outdoor,
        };
        return accum;

      }, returnData)
      return res.json(returnData)
    })
    .catch((error) => {
      console.log(error);
      res.send('ERROR! cannot grab links from database')
    })
}

// get route for pictures
app.get('/pictures', grabPics);

// send login to database
app.post('/login', grabUserId, updateCityId, (req, res) => {
  return res.json(res.locals.userid);
});

// upload pics
app.post('/uploadPicture', (req, res) => {
  let { userUuid, uploadedFileCloudinaryUrl, uploadText, uploadStyleClickNightOut, uploadStyleClickOutDoor } = req.body;
  db.any('INSERT INTO pictures(id, userid, city, latitude, longitude, likes, description, date, picture_url, style_nightlife, style_outdoor) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);'
    , [userUuid, res.locals.cityid, res.locals.latitude, res.locals.longitude, 0, uploadText, null, uploadedFileCloudinaryUrl, uploadStyleClickNightOut, uploadStyleClickOutDoor])
    .then((data) => {
      console.log('Success storing picture info');
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.send('ERROR! Could not save picture to database');
    });
})

// NEW ROUTE FOR SIGNUP
app.post('/signup', (req, res, next) => {
  db.any('INSERT INTO users(id, username, password, city, latitude, longitude) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5);', [req.body.username, req.body.password, 'e32c724b-ea5e-4994-9d95-80a27d6fc830', req.body.latitude, req.body.longitude])
    .then((data) => {
      res.json(data)
      console.log('res.json.data: ', res.json(data));
      next();
    })
    .catch((error) => {
      // error;
      console.log(error);
      res.send('ERROR! Could not send to database');
    })
});

// check if server is online and connected
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on Port: ${PORT}...`);
});

// const io = require('socket.io')(server);
// require('./socketRooms/defineSockets')(io);