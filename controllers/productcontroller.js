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

const deleteProduct =async(req,res)=>{
    try {
        const id=req.params.id;
        await product.deleteOne({_id:id});
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error.message);
    }
}
const editProduct=async(req,res)=>{
    try {
        const productData=await product.findById(req.params.id);
        const categoryData=await Category.find();
        res.render('editproduct',{product:productData,Category:categoryData});

    } catch (error) {
        console.log(error.message);
    }
}

const UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    let imgArray = [];

    if (req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        imgArray.push(req.files[i].filename);
      }
    }

    const productData = {
      productName: req.body.productname,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
    };

    if (imgArray.length > 0) {
      productData.images = imgArray;
    }

    await product.updateOne({ _id: id }, { $set: productData });
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports={
  
    loadProduct,
    addProduct,
    insertProduct,
  
    deleteProduct,
    editProduct,
    UpdateProduct
   

    
}