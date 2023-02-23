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
userRoute.get('/cart',usercontroller.loadCart);

// user post routers

userRoute.post('/register',usercontroller.uploadRegister);
userRoute.post('/login',usercontroller.verifyLogin);
userRoute.post('/logout',usercontroller.verifyLogin);


module.exports=  userRoute;