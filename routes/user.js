const express = require('express')
const router = express.Router()
// JWT Token and it's m3thods
const jwt = require('jwt-simple')

// Passport authentication methods we wrote
const passport = require('../config/passport')

// secret key to unlock and lock jwts
const config = require('../config/config')

// requiring our user to CRUD users
const mongoose = require('../models/User')
const User = mongoose.model('User')

// /users/signup
router.post('/signup', (req, res) => {
  // if they gave us an email and password
  if (req.body.email && req.body.password) {
    // creating a new user based off the req.body
    let newUser = {
      email: req.body.email,
      password: req.body.password
    }
    // find a user based on that email
    User.findOne({ email: req.body.email })
      .then((user) => {
        // if we don't hvae a user in our db
        if (!user) {
          // then we'll create a new user
          User.create(newUser)
            .then(user => {
              // if we successfully created that user
              if (user) {
                // create a payload
                let payload = { id: newUser.id }
                // create a jwt token with that payload
                let token = jwt.encode(payload, config.jwtSecret)
                // after i've made that token, i send it back as success
                res.json({ token })
              // user was not successfully made  
              } else {
                res.sendStatus(401).json({err: 'We\'re tired. try again'})
              }
            })
        // we already have a user in our db
        } else {
          res.status(401).json({err: 'Email already exists'})
        }
      })
  } else {
    // didn't have an email and password
    res.json({err: 'Invalid username or password'})
  }
});

// /users/login
router.post('/login', (req, res) => { 
  // if they gave us an email and password
  if (req.body.email && req.body.password) {
    // find a user by email
    User.findOne({ email: req.body.email }).then(user => {
      // if we found a user
      if (user) {
        // if user's password equals the req.body password
        if (user.password === req.body.password) {
          // then they're who they say they are
          // lets make a payload of their user id
          let payload = { id: user.id }
          // lets make a token out of their user id and our secret
          let token = jwt.encode(payload, config.jwtSecret)
          // lets send that new token back to them
          res.json({ token })
        } else {
          // email/password are incorrect
          res.sendStatus(401)
        }
        // we didn't find that user
      } else {
        res.sendStatus(401)
      }
    })
    // didn't give us both email and password
  } else {
    res.sendStatus(401)
  }
})


module.exports = router