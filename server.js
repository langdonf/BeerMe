const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = require('./config/keys').mongoURI,
    cors = require('cors')

// serve static files in public
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({ 
      extended: true
    })
  );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors())

//Connect to MongoDB
mongoose
    .connect(db)
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})
app.use("/routes/api/user", user);

// let port = process.env.PORT || 3000;

app.listen(3000, function() {
    console.log(`BeerMe listening at port 3000`);
});