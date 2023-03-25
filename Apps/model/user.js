const mongoose = require('mongoose')
const Joi = require('joi')
const userSchema = new mongoose.Schema({
    name :{
        type : String,
        minlength : 5,
        maxlength : 255,
        required : true
    },
    email : {
        type : String,
        minlength : 8,
        maxlength : 255,
        required : true
    },
    // userId : {
    //     type : Number,
    //     unique : true,
    //     required : true
    // },
    password : {
        type : String,
        required : true,
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
    resetPasswordToken  : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    }

})

const User = mongoose.model('Users',userSchema,'Users');

const schema = Joi.object({
    name : Joi.string().min(5).max(255).required(),
    email : Joi.string().min(8).max(255).required().email(),
    password : Joi.string().min(5).max(255).required(),
    role : Joi.string().min(4).max(255),
    gender : Joi.string().min(3).max(255),

}) 

exports.User = User;
exports.schema = schema;