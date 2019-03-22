const 
  bcrypt = require('bcrypt'),
  db = require('../models'),
  jwt = require('jsonwebtoken')

module.exports = {
    signup : (req, res) => {
        console.log(req.body);
        // Check to see if email is already in db
        db.User.find({email: req.body.email})
          .exec()
          .then( user => {
            // if a user is found with that email
            if (user.length >= 1) {
              // send an error and let the user know that the email already exists
              return res.status(409).json({
                message: "email already exists"
              })
            // if we don't have this user's email in our db, lets get them set up!
            } else {
              // lets hash our plaintext password
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){ 
                  console.log("hashing error:", err);
                  res.status(200).json({error: err})
                // we now have a successful hashed password
                } else {
                  // we are creating a User object with their email address and OUR hashed password
                  db.User.create({
                    email: req.body.email,
                    password: hash
                  }, {password: 0}, (err, result) => {
                      
                    // if(err){ return res.status(500).json({err})}
                    // we send our new data back to user or whatever you want to do.
                  result = result[0]
                  jwt.sign(
                      {result},
                      "waffles",
                      (err, signedJwt) => {
                      res.status(200).json({
                        message: 'User Created',
                        result,
                        signedJwt
                      })
                    });
                    // send success back to user, along with a token.
                  })
                }
              })
            }
          })
          .catch( err => {
            console.log(err);
            res.status(500).json({err})
          })
      },
    login: (req, res) => {
        console.log("LOGIN CALLED");
        // find the user in our user db
        console.log("body", req.body)
        db.User.find({email: req.body.email})
          .select('+password')
          .exec()
          // if we have found a user
          .then( users => {
            // if there is not email in our db
            console.log("USERS: ", users);
            if(users.length < 1) {
              return res.status(401).json({
                message: "Email/Password incorrect"
              })
            }
            // we have an email in our db that matches what they gave us
            // now we have to compare their hashed password to what we have in our db
            console.log("body", req.body);
            console.log("hash", users[0].password);
            bcrypt.compare(req.body.password, users[0].password, (err, match) => {
              console.log(match)
              // If the compare function breaks, let them know
              if(err){console.log(err);return res.status(500).json({err})}
              // If match is true (their password matches our db password)
              if(match){
                console.log("MATCH: ", match)
                // create a json web token
                const token = jwt.sign(
                  {
                    // add some identifying information
                    email: users[0].email,
                    _id: users[0]._id
                  }, 
                  // add our super secret key (which should be hidden, not plaintext like this)
                  "waffles",
                  // these are options, not necessary
                  {
                    // its good practice to have an expiration amount for jwt tokens.
                    expiresIn: "1h"
                  },
                );
                console.log("NEW TOKEN: ", token)
                // send success back to user, along with a token.
                return res.status(200).json(
                  {
                    message: 'Auth successful',
                    token
                  }
                )
              // the password provided does not match the password on file.
              } else {
                console.log("NOT A MATCH")
                res.status(401).json({message: "Email/Password incorrect"})
              }
            })
      
      
          })
          .catch( err => {
            console.log("OUTSIDE ERROR_")
            console.log(err);
            res.status(500).json({err})
          })
        },
    delete: (req, res) => {
        console.log("hitting delete");
        db.User.deleteOne({_id: req.params.userId}, (err, result) =>{
          if(err){return res.status(500).json({err})}
          res.status(200).json({result})
        })
      }
}