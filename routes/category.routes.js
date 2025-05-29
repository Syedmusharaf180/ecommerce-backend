/**
 * POST localhost:8888/ecom/api/v1/auth/categories
*/
const category_controller = require("../controllers/category.controller")
const auth_mw = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/ecom/api/v1/auth/categories", [auth_mw.verifyToken,auth_mw.isAdmin], category_controller.createNewCategory)
}

// Now stitch it to server.js file