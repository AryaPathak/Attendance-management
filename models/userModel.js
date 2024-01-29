const crypto = require('crypto');

/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const validator = require('validator');



const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid string']
    },
    photo: String,
   
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: "Password not same"
        },
        select: false
    },
    loginTime: {
        type: Date,
        default: null,
    },
    active:{
        type: Boolean,
        default: false
    },
    workHours: {
        type: String,
        default: '0 hours, 0 minutes, 0 seconds',
    },
    finishTime:{
        type: Date,
        default: null,
    },
    workHistory: [
        {
            loginTime: {
                type: Date,
                default: Date.now(),
            },
            workHours: {
                type: String,
                default: '0 hours, 0 minutes, 0 seconds',
            },
            finishTime: {
                type: Date,
                default: Date.now(),
            }
        }
    ],
});

// Middleware to update logout time before saving



userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    
    return candidatePassword === userPassword;
};


// userSchema.methods.correctPassword = async function(
//     candidatePassword, 
//     userPassword
// ){
//     return await bcrypt.compare(candidatePassword, userPassword);
// }


const User = mongoose.model('User', userSchema);

module.exports = User;