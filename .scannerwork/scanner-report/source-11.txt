/**
 * @description: requiring mongoose ORM
 */

const mongoose = require('mongoose');

/**
 * @description: mongodb schema for labels 
 */

var schema = mongoose.Schema;
var userSchema = new schema({  

    firstName: {
        type: String,
    },
    lastName: {
        type: String,

    },
    email: {
        type: String,

    },
    password: {
        type: String,

    },
    isEmailverify: {
        type : Boolean, 
        default : false
    },
    gitVerify: {
        type: Boolean,
        default: false
    },
    gitID: {
        type: String,
        default: ""
    },
    gitUsername: {
        type: String,
        default: ""
    },
    gitToken: {
        type: String
    },
    imageUrl: {
        type: String
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('users', userSchema); // exporting the model