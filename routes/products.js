const router = require('express').Router();
let Product = require('../models/product.model');
const jwt = require('jsonwebtoken');

router.route('/').get(async (req, res) => {
  try {
    let products = await Product.find({});
    res.status(200).json({
      products
    });
  }
  catch (error) {
    res.send(error);
  }
});

router.route('/find').post(async (req, res) => {
  name = req.body.name;
  try {
    let productExist = await Product.findOne({ name });
    // res.send(productExist);
    res.status(200).send(productExist);
  }
  catch (error) {
    res.send(error);
  }
});

router.route('/update').put(async (req, res) => {
  let name = req.body.name;
  try {
    let productExist = await Product.findOne({ name });
    productExist.name = req.body.name;
    productExist.description = req.body.description;
    productExist.quantity = req.body.quantity;
    productExist.save()
      .then(() => res.send('Product Updated!'))
      .catch(err => res.json('Product Saving Issue', err));
  }
  catch (error) {
    res.send(error);
  }
});


router.route('/add').post((req, res) => {

  name = req.body.name;
  description = req.body.description;
  quantity = req.body.quantity;

  const newProduct = new Product({ name, description, quantity });

  newProduct.save()
    .then(() => res.json('Product added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update').put(async (req, res) => {
  let name = req.body.name;
  try {
    let productExist = await Product.findOne({ name });
    productExist.name = req.body.name;
    productExist.description = req.body.description;
    productExist.quantity = req.body.quantity;
    productExist.save()
      .then(() => res.send('Product Updated!'))
      .catch(err => res.json('Product Saving Issue', err));
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.route('/remove').delete(async (req, res) => {
  let name = req.body.name;
  try {
    let productExist = await Product.remove({ name });
    // res.status('ok').json('Product Deleted' + productExist);
    if (productExist.deletedCount > 0) {
      res.status(200).send('Product deleted');
    }
    else {
      res.status(404).send('Product does not exist');
    }
  }
  catch (error) {
    res.send(error);
  }
});

// router.route('/info').post(checkAuthentication, (req, res) => {

//   jwt.verify(req.token, 'secretkey123secretkey', (error, user) => {
//     if (error) {
//       res.sendStatus(403);
//     }
//     else {
//       res.send(user);
//     }
//   });
// });

// function checkAuthentication(req, res, next) {
//   // get auth header here
//   const bearerHeader = req.headers['authorization'];

//   // Format of Token
//   // Authorization: Bearer <access_token>
//   if (typeof bearerHeader !== 'undefined') {
//     // split at space and turns string into array
//     const bearer = bearerHeader.split(' ');
//     // get token from array
//     const bearerToken = bearer[1];
//     // set the token
//     req.token = bearerToken;
//     // Next Middleware
//     next();
//   } else {
//     res.sendStatus(403);
//   }

// }

module.exports = router;