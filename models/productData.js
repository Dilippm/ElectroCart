const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');

const productData = mongoose.Schema({
 productName:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  },
  images:{
    type:Array,
    required:true
  }
})
module.exports =mongoose.model('product',productData);