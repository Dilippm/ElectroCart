const mongoose =require('mongoose');
const userData= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
       default:false
    }
    
})
module.exports =mongoose.model('user',userData);