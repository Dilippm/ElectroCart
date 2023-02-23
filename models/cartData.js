const mongoose =require('mongoose');

const cartData = new mongoose.Schema({
    product:{
        type:String,
        requird:true
    },
    userid:{
        type:String,
        requird:true
    },
    price:{
        type:Number,
        required:true
    }
})

module.exports =mongoose.model('cart',cartData);