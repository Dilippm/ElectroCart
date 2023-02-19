const express=require('express')
const userRoute=express();
const session =require('express-session');

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
userRoute.get('/',usercontroller.loadHome);
userRoute.get('/login',usercontroller.loadLogin);
userRoute.get('/register',usercontroller.loadRegister);


// user post routers

userRoute.post('/register',usercontroller.uploadRegister);
userRoute.post('/login',usercontroller.verifyLogin);


module.exports=  userRoute;