const express=require('express')
const userRoute=express();
const session =require('express-session');

//session
const config = require('../config/config');
userRoute.use(session({secret:config.sessionSecret}));

// middleware
const userauth= require("../middlewares/userauth");

const bodyparser=require('body-parser')
//controller
const usercontroller=require('../controllers/usercontroller')
const cartcontroller=require('../controllers/cartcontroller')
const ordercontroller=require('../controllers/ordercontroller')
// morgan
const logger=require('morgan');
userRoute.use(logger('dev'));

//view engine
userRoute.set('view engine','ejs')
userRoute.set('views','./views/user')



//bodyparser

userRoute.use(bodyparser.json())
userRoute.use(bodyparser.urlencoded({extended:true}));
const path=require('path');

userRoute.use(express.static(path.join(__dirname,'public')))

//user get routers

// userRoute.get('/',usercontroller.loadHome);
userRoute.get('/',userauth.islogout,usercontroller.guest);
userRoute.get('/userhome',userauth.islogin,usercontroller.userHome)

userRoute.get('/login',userauth.islogout,usercontroller.loadLogin);
userRoute.get('/register',userauth.islogout,usercontroller.loadRegister);
userRoute.get('/logout',userauth.islogin,usercontroller.userLogout);
userRoute.get('/productview/:id',usercontroller.productView)
userRoute.get('/cart',cartcontroller.viewCart);
userRoute.get('/add-to-cart/:id',cartcontroller.addCart);
userRoute.get('/deletecart/:id',cartcontroller.deleteCart);
//userRoute.get('/deletecart/:id',usercontroller.deleteCart);

userRoute.get('/profile',usercontroller.profile);
userRoute.get('/address',usercontroller.addressView);
userRoute.get('/edit-user',usercontroller.editUser);
userRoute.get('/addAddress',usercontroller.addAddress);
userRoute.get('/editAddress/:id',usercontroller.editaddress);
userRoute.get('/removeAddress/:id',usercontroller.removeAddress);
userRoute.get('/checkout',ordercontroller.loadCheckOut);
userRoute.post('/checkout',ordercontroller.successLoad);




// user post routers

userRoute.post('/register',usercontroller.uploadRegister);
userRoute.post('/login',usercontroller.verifyLogin);
userRoute.post('/logout',usercontroller.verifyLogin);
//userRoute.post('/edit-qty',usercontroller.editQty);
userRoute.post('/editedProfile/:id',usercontroller.updateUser);
userRoute.post('/addAddress',usercontroller.insertAddress);
userRoute.post('/editAddress/:id',usercontroller.editedAddress);
userRoute.post ('/change-Product-Quantity',cartcontroller.changeQuantity);




module.exports=  userRoute;