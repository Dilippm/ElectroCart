const product = require('../models/productData');

const loadProduct=async(req,res)=>{
    try {
        const productdata = await product.find({})
        res.render('adminproduct', { productData: productdata })
    } catch (error) {
        console.log(error.message);
    }
}
const addProduct=async(req,res)=>{
    try {
        res.render('addproduct')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
  
    loadProduct,
    addProduct
    
}