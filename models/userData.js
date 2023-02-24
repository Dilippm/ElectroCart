const mongoose =require('mongoose');
const product = require('./productData')
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
    },
    cart:{
        item:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'product',
                required:true
            },
            qty:{
                type:Number,
                required:true
            },
            price:{
                type:Number
            },
        }],
        totalPrice:{
            type:Number,
            default:0
        }
    },
    address: [
        {
          houseName: {
            type: String,
            required: true
          },
          street: {
            type: String,
            required: true
          },
          district: {
            type: String,
            required: true
          },
          state: {
            type: String,
            required: true
          },
          pincode: {
            type: String,
            required: true
          },
          country: {
            type: String,
            required: true
          },
          phone: {
            type: Number,
            required: true
          },
        }
      ],
    
})
userData.methods.addToCart = function (product, users, use) {
  const cart = this.cart;
  const isExisting = cart.item.findIndex(objInItems => {
    return new String(objInItems.productId).trim() == new String(product._id).trim();
  });

  if (isExisting >= 0) {
    cart.item[isExisting].qty += 1;
  } else {
    cart.item.push({
      productId: product._id,
      qty: 1,
      price: product.price
    });
  }

  const newItem = cart.item.find(item => item.productId == product._id);
  cart.totalPrice += newItem.price * newItem.qty; // Multiply price by quantity
  console.log("User in schema:", this);

  return this.save();
}


  userData.methods.removeFromCart =async function (productId){
    const cart = this.cart
    const isExisting = cart.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
    if(isExisting >= 0){
        const prod = await product.findById(productId)
        cart.totalPrice -= prod.price * cart.item[isExisting].qty
        cart.item.splice(isExisting,1)
        console.log("User in schema:",this);
        return this.save()
    }
}


  
  
module.exports =mongoose.model('user',userData);