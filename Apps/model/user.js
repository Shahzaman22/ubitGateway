const mongoose = require('mongoose')
const Joi = require('joi')
const userSchema = new mongoose.Schema({
    name :{
        type : String,
        minlength : 5,
        maxlength : 255
    },
    email : {
        type : String,
        minlength : 8,
        maxlength : 255,
    },
    password : {
        type : String 
    },
    confirmPassword : {
        type : String
    },
    role : {
        type : String,
        enum : ["user","employer","admin"],
        default : "user"
    }


})

const User = mongoose.model('Users',userSchema,'Users');

const schema = Joi.object({
    name : Joi.string().min(5).max(255),
    email : Joi.string().min(8).max(255).email(),
    password : Joi.string().min(5).max(255),
    confirmPassword : Joi.string().min(5).max(255),
    role : Joi.string().min(4).max(255),

    

}) 

exports.User = User;
exports.schema = schema;