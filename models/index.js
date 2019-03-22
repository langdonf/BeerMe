const keys = require("../config/keys")
const mongoose = require('mongoose')

mongoose.connect(keys.mongoURI)


module.exports.User = require('./user')