
const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = require('/.config/keys').mongoURI


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

    let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`BeerMe listening at port ${port}`);
});