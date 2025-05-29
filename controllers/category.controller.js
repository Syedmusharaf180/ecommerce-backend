const category_model = require("../models/category.model")

/**
 * Controller for creating the category
 * 
 * POST localhost:8888/ecom/api/v1/auth/categories
 * 
 * Req body : 
 * {
    "name" : "Household",
    "description" : "This will have all the household items"
   }
 * 
 */

exports.createNewCategory = async (req, res) => {
    
  // Read the req body
  // Create the category object 
  const cat_data = {
    name: req.body.name,
    description : req.body.description
  }
  
  try {
    // Insert into mongodb 
    const category = await category_model.create(cat_data)
    return res.status(201).send(category)  
  } catch (err) {
    console.log("Error while creating the category", err)
    return res.status(500).send({
      message : "Error while creating the category"
    })
  }
  
  // return the response of the created category
    
}