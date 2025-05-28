const mongoose = require('mongoose') 


/**
 --> we will track the following of user
 * name 
 * userId
 * password
 * eamil
 * userType
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unique: true
    },
    userType: {
        type: String,
        default: "CUSTOMER",
        enum : ["CUSTOMER","ADMIN"]  // user can be either customer or admin
    }
}, { timestamps: true, versionKey: false })
 

// mongoose.model("User",userSchema) // it will create a collection in DB named "users" (in plural)

// now we want to export these whole code as a module, so we will use "moudle.exports" 
module.exports = mongoose.model("User", userSchema) 


/**
  User ---> 1. Cutomers (created through APIs) , 2. Admin (creation is done internally (in server.js) )
 */