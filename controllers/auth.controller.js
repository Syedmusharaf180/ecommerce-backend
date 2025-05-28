/**
 * I need to write the controller / logic to register a user 
 */

const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")


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