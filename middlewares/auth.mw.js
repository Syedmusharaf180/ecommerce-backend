/**
 * client -----> server(app) ----> route ----(middleware)------> controller ------> model
 */
/**
 * Create a middleware which will check if the request body is proper and correct.
*/
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../config/auth.config")

const verifySignUpBody = async (req, res, next) => {
    
    try {

        // check for the name
        if (!req.body.name) {
            return res.status(400).send({
                message: "Failed ! name was not provided in request body"
            })
        }

        // check for the email
        if (!req.body.email) {
            return res.status(400).send({
                message: "Failed ! email was not provided in request body"
            })
        }
        
        // check for the userId
        if (!req.body.userId){
            return res.status(400).send({
                message : "Failed! userId was not provided in request body"
            })
        }
        
        // check if the user with the same userId is already present 
        const user = await user_model.findOne({ userId: req.body.userId })
        
        if (user) {
            return res.status(400).send({
                message: "Failed! user with same userId is already present"
            })
        }

        next(); // move to next 

    } catch (err) {
        console.log("Error while validating the request object", err)
        res.status(500).send({
            message : "Error while validating the request body"
        })
    }
}

const verifySignInBody = (req, res, next) => {
    
    // check for userId
    if (!req.body.userId) {
        return res.status(400).send({
            message : "userId is not provided"
        })
    }
    
    // check for password
    if (!req.body.password) {
        return res.status(400).send({
            message : "password is not provided"
        })
    }

    // move to next 
    next()

}

// checking the token to give access to create new category in app
const verifyToken = (req, res, next) => {
    // check the token is present in the header
    const token = req.header('x-access-token')

    // if token is not present at all 
    if (!token) {
        return res.status(403).send({
            message : "No token found : Unauthorized"
        })
    }

    // if present, it's a valid token
    jwt.verify(token, auth_config.SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message : "UnAuthorized !"
            })
        }

        // since we used userId to generate token, so decoded.id is the same userId after decoding
        const user = await user_model.findOne({ userId: decoded.id })
        
        // user is not present 
        if (!user) {
            return res.status(400).send({
                message : "UnAuthorized, this user for this token doesn't exist"
            })
        }

        // Here we got the user info so let's Set the user info in the req.body (so that can be used further)
        req.user = user

        // it should go next() only when it is verified, otherwise we won't go
        next()
    })
    
}

// Only Admin should have access to create category in the app  
const isAdmin = (req, res, next) => {
    const user = req.user // since in token verification we set the req.user = user
    if (user && user.userType == "ADMIN") {
        next()
    } else {
        return res.status(403).send({
            message : "Only ADMIN users are allowed to access this endpoint"
        })
    }
}



module.exports = {
    verifySignUpBody: verifySignUpBody,
    verifySignInBody: verifySignInBody,
    verifyToken: verifyToken,
    isAdmin : isAdmin
}

// this middleware should be used or imported in routes(authroutes), in order to check the req.body while sending the http request 