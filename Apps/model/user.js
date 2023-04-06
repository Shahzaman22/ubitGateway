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
    role : {
        type : String,
        enum : ["user","admin","teacher","employer"],
        default : "user"
    },
    gender : {
        type : String,
        enum : ['male','female','other'],
    },
    img : {
        type : String,
    },
    is_Active :{
        type : Boolean
    }


})

const User = mongoose.model('Users',userSchema,'Users');

const schema = Joi.object({
    name : Joi.string().min(5).max(255),
    email : Joi.string().min(8).max(255).email(),
    password : Joi.string().min(5).max(255),
    role : Joi.string().min(4).max(255),
    gender : Joi.string().min(3).max(255),
    img : Joi.string().min(3).max(255),

}) 

exports.User = User;
exports.schema = schema;