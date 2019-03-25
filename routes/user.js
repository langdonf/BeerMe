const 
  express = require('express'),
  router = express.Router(),
  bcrypt = require('bcrypt'),
  db = require('../models'),
  jwt = require('jsonwebtoken'),
  controllers = require('../controllers')


router.post('/signup', controllers.user.signup);

router.post('/login', controllers.user.login)

router.get('/:userId/savedbeers', controllers.user.savedBeers)

router.put('/:userId/:beerId', controllers.user.addBeer)

router.put('/:userId/:beerId/:ratingValue', controllers.user.addRating)


module.exports = router;