const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String, 
    username: String, 
    password: String,
    savedBeers:{
        id: Number,
    },
    comments:{
        text: String,
        beerId: Number
    },
    rating:{
        value: Number,
        beerId: Number
    }
})

module.exports = User = mongoose.model("user", UserSchema);