const router = require('express').Router();
let User = require('../models/user.model');
let Files = require('../models/files.model');
const jwt = require('jsonwebtoken');
const upload = require('./FileUpload');


// file upload path //
router.post('/fileUpload', checkAuthentication, (req, res, next) => {
  jwt.verify(req.token, 'secretkey123secretkey', async (error, user) => {
    if (error) {
      res.sendStatus(403);
    }

    try {
      const _id = user.user.id;
      let userExist = await User.findById({ _id });
      req.user_id = _id;
      next();
    }
    catch (error) {
      res.sendStatus(404);
    }
  })
}, upload.single('file'), async (req, res, next) => {
  const filePath = 'files/uploads/' + req.file.filename;
  const userId = req.user_id;
  let newFile = new Files({ userId, filePath });
  try {
    const result = await newFile.save();
    res.status(200).send({ 'File Path : ': filePath });
  }
  catch (error) {
    res.send(error);
  }
});

router.route('/login').post(async (req, res) => {
  let user = {};
  user.email = req.body.email;
  user.password = req.body.password;

  const { email, password } = user;

  let userExist = await User.findOne({ email });
  if (userExist && userExist.email === email && userExist.password === password) {
    user.id = userExist._id;
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
  const role = req.body.role;


  const newUser = new User({ name, email, password,role });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/info').post(checkAuthentication, (req, res) => {
  jwt.verify(req.token, 'secretkey123secretkey', async (error, user) => {
    if (error) {
      res.sendStatus(403);
    }

    try {
      const _id = user.user.id;
      let userExist = await User.findById({ _id });
      res.status(200).send(userExist);
    }
    catch (error) {
      res.sendStatus(404);
    }
  })
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