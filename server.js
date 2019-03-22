const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    cors = require('cors'),
    userRoutes = require("./routes/user"),
    passport = require("passport"),
    jwt = require('jsonwebtoken')
    
    
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
// routes for login and signup
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.post('/verify', verifyToken, (req, res) => {
    let verified= jwt.verify(req.token, 'waffles')
    console.log("verified: ", verified)
    res.json(verified)
})

// SAMPLE PROTECTED ROUTE!
// protected route - a route only a user with a jwt token in their header can access.
app.post('/protectedPage', verifyToken, (req, res) => {
    console.log(req.token)
    jwt.verify(req.token, 'waffles', (err, authData) => {
    if(err) {
        res.sendStatus(403);
    } else {
        res.json({
        message: 'Post created',
        authData
        });
    }

    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Tokenj 
function verifyToken(req, res, next) {
    console.log("in verify...");
    // Get auth header value
    // when we send our token, we want to send it in our header
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
    } else {
    // Forbidden
    res.sendStatus(403);
    }
}


app.listen(3000, function() {
console.log(`BeerMe listening at port 3000`);
});

