/**
 * This will be the starting file of the project.
 */
const express = require('express')
const mongoose = require('mongoose')
const server_config = require("./config/server.config")
const app = express()
const db_config = require("./config/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")

app.use(express.json()) // it is a middleware, whenever we get JSON it reads as JS objects
/**
 * In general we sent req body in JSON form, but our Node.js app understand only JS object 
 * For that reason we use express middleware for parsing the data from JSON to JS object form
 */


/**
 * Create an admin user at the starting of the application 
 * If not already existed 
*/

// Connection with mongodb 
mongoose.connect(db_config.DB_URL)

const db = mongoose.connection 

db.on("error", () => {
    console.log("Error while connecting to the mongoDB")
})

db.once("open", () => {
    console.log("Connected to MongoDB")
    init() 
})

async function init() {
    try {
        let user = await user_model.findOne({ userId: "admin" })
    
        if (user) {
            console.log("Admin is already present")
            return
        }
    } catch (err) {
        console.log("Error while reading the data",err)
    }

    // creating the admin if not present in DB 
    try {
        // logic to create admin 
        user = await user_model.create({
            name: "Musharaf",
            userId: "admin",
            email: "sm1824@gmail.com",
            userType: "ADMIN",
            // password: "welcome1"  , before storing password into DB, it needs to be encrypted using bcryptjs
            password: bcrypt.hashSync("welcome1",8) // 8 - is no. of hashing rounds or salt rounds (can increase for more security)
        })
        console.log("Admin created :",user)

    } catch (err) {
        console.log("Error while creating admin",err)
    }
}

/**
 * Stich the route to the server
 * we need to call the route in this server.js file
*/

require("./routes/auth.routes")(app) // here we are calling routes and passing app object

// at this point now server knows about routes and routes knows about the controller and controller knows model
// everything is now connected with each other.

// stiching the category routes 
require("./routes/category.routes")(app)

// start the server 
app.listen(server_config.PORT, () => {
    console.log("Server started at port number : ",server_config.PORT)
})