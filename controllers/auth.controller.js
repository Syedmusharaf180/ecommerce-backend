/**
 * I need to write the controller / logic to register a user 
 */

const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const secret = require("../config/auth.config")

// we are exporting this method so that it is available as module everywhree in the project 
// signup --> it helps to create/register a user
exports.signup = async (req, res) => {
    /**
     * Logic to create the user
    */
    
    // step 1 : Read the request body
    const request_body = req.body // it will get the request body in the form of JS object

    // step 2 : Insert the data in the Users collections in MongoDB
    const userObj = {
        name: request_body.name,
        userId: request_body.userId,
        email: request_body.email,
        userType: request_body.userType,
        password: bcrypt.hashSync(request_body.password,8)
    }

    try {
        const user_created = await user_model.create(userObj)
        /**
         * Return this user 
         */

        const res_obj = {
            name: user_created.name,
            userId: user_created.userId,
            email: user_created.email,
            userType: user_created.userType,
            createdAt: user_created.createdAt,
            updatedAt : user_created.updatedAt
        }

        res.status(201).send(res_obj)

    } catch (err) {
        console.log("Error while registering the user", err)
        res.status(500).send({
            message: "Some error happend while registering the user"
        })
    }

    // step 3 : Return the response back to user
}


exports.signin = async (req, res) => {
    
    // 1. check if the user id is present in the system
    const user = await user_model.findOne({ userId: req.body.userId })
    
    if (user == null) {
        return res.status(400).send({
            message : "User Id passed is not a valid User Id"
        })
    }

    // 2. Password is correct 
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password) 
    // "req.body.password" is a normal string and "user.password" is encrypted one, bcrypt provides inbuilt function to comparison
    if (!isPasswordValid) {
        return res.status(400).send({
            message: "Wrong password passed"
        })
    }

    // 3. Using JWT we will create the access token with a given TTL(time to live) and return 
    const token = jwt.sign({ id: user.userId }, secret.SECRET, {
        expiresIn : 120 // in seconds
    })

    // "sign" is method used to create a token, here we have created token based on the userId data
    // sign method takes 3 arguments i.e. data, secret code, TTl(expiry time)

    // now we have created access token, we will send this as a response
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        accessToken : token
    })
}