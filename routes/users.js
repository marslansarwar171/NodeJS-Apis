const router = require('express').Router();
let User = require('../models/user.model');
const jwt = require('jsonwebtoken');

router.route('/login').post(async (req, res) => {
  let user = {};
  user.email = req.body.email;
  user.password = req.body.password;

  const { email, password } = user;

  let userExist = await User.findOne({ email });
  if (userExist && userExist.email === email && userExist.password === password) {
    jwt.sign({ user: user }, 'secretkey123secretkey', (error, token) => {
      res.status(200).json({
        "access_token": token
      });
    });
  }
  else {
    res.status(404).send('Email or Password incorrect');
  }
});

router.route('/signup').post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({ name, email, password });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/info').post(checkAuthentication, (req, res) => {

  jwt.verify(req.token, 'secretkey123secretkey', (error, user) => {
    if (error) {
      res.sendStatus(403);
    }
    else {
      res.send(user);
    }
  });
});

function checkAuthentication(req, res, next) {
  // get auth header here
  const bearerHeader = req.headers['authorization'];

  // Format of Token
  // Authorization: Bearer <access_token>
  if (typeof bearerHeader !== 'undefined') {
    // split at space and turns string into array
    const bearer = bearerHeader.split(' ');
    // get token from array
    const bearerToken = bearer[1];
    // set the token
    req.token = bearerToken;
    // Next Middleware
    next();
  } else {
    res.sendStatus(403);
  }

}

module.exports = router;