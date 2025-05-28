/**
 * POST localhost:8888/ecom/api/v1/auth/singup
 * 
 * I need to intercept this
 * 
 * "app" object we created in server.js helps to intercept the incoming request
 * app(present in the express server) ---> route ---> controller ---> model
 */

const authController = require("../controllers/auth.controller")
const authMW = require("../middlewares/auth.mw") // importing authmiddleware to check the req body while sending the http request

module.exports = (app) => {
    // if someone makes the post call with the URI present in the double quotes, then app intercept the post call 
    // with appropriate URI to the right controller (which can be imported from controllers)
    app.post("/ecom/api/v1/auth/signup",[authMW.verifySignUpBody], authController.signup) // handover to the right controller
    
    // "[authMW.verifySignUpBody]" is a middleware which check the req body before signing up 
    // route is like receiptionist , controller is like waiter
    
    /**
     * Defining route for 
     * POST  localhost:8888/ecom/api/v1/auth/signin
    */
    app.post("/ecom/api/v1/auth/signin", authController.signin)
    
}

// after this we have to connect this route to the app server (i.e. in server.js)