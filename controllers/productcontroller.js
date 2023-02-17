const product = require('../models/productData');
const Category =require("../models/categoryData");

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
        const category= await Category.find({})
        res.render('addproduct',{sendcategory:category})
    } catch (error) {
        console.log(error.message);
    }
}
const insertProduct =async(req,res)=>{
    try {
        var arrImages=[];
        for(let i=0;i<req.files.length;i++){
            arrImages[i]= req.files[i].filename;
        }
         
        const newProduct= new product({
            productName:req.body.productName,
            category:req.body.category,
           
            description:req.body.description,
            price:req.body.price,
            quantity:req.body.quantity,
            images:arrImages
        });
      const productData = await  newProduct.save();
      if(productData){
        res.redirect('/admin/product');
      }else{
        res.render('addproduct',{message:'Failed to add new product'});

      }

    } catch (error) {
        console.log(error.message);
    }
}
const loadEditProduct =async(req,res)=>{
    try {
        
        const category= await Category.find({})
        res.render('editproduct',{sendcategory:category})
    } catch (error) {
        console.log(error.message);
    }
    try {
        const id=req.params.id;
        console.log(id);
        const categorydata=await category.findById({_id:id})
        res.render('editcategory',{vcategory:categorydata});
      } catch (error) {
        console.log(error.message);
      }
}
const deleteProduct =async(req,res)=>{
    try {
        const id=req.params.id;
        await product.deleteOne({_id:id});
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error.message);
    }
}
 
module.exports={
  
    loadProduct,
    addProduct,
    insertProduct,
    loadEditProduct,
    deleteProduct,

    
}