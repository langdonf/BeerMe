const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ ,
        },
    username: String, 
    password: { type: String, required: true , select: false},
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

module.exports = mongoose.model("User", userSchema);
