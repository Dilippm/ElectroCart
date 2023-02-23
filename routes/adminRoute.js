const express=require('express')
const adminRoute=express()
const bodyparser=require('body-parser')
const config = require('../config/config')
const auth = require('../middlewares/auth')
const nocache =require('nocache')
adminRoute.use(nocache());

const session =require("express-session")
adminRoute.use(session({secret:config.sessionSecret}));

const admincontroller=require('../controllers/admincontroller')
const categorycontroller = require('../controllers/categorycontroller')
const productcontroller = require('../controllers/productcontroller')
const adminusercontroller = require('../controllers/adminusercontroller')


adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')

adminRoute.use(bodyparser.json())
adminRoute.use(bodyparser.urlencoded({extended:true}));
const path=require('path')
adminRoute.use(express.static(path.join(__dirname,'public')))

// multer for image upload

const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'))
    },
    filename:function(req,file,cb){
            const name = Date.now()+'-'+file.originalname;
            cb(null,name)
                }
            
    
});
const upload = multer({storage:storage});

adminRoute.get('/',auth.isLogout,admincontroller.adminRegister)
adminRoute.post('/',admincontroller.verifylogin)



adminRoute.get('/dashboard',auth.isLogin,admincontroller.loadDashboard)

adminRoute.get('/logout',auth.isLogin,admincontroller.adminLogout)
adminRoute.get('/category',auth.isLogin,categorycontroller.adminCategory)
adminRoute.get('/category/addcategory',auth.isLogin,categorycontroller.adminAddCategory)
adminRoute.post('/category',categorycontroller.addNewCategory)
adminRoute.get('/category/deletecategory/:id',auth.isLogin,categorycontroller.deleteCategory);
adminRoute.get('/category/editcategory/:id',auth.isLogin,categorycontroller.viewEditCategory);
adminRoute.post('/category/editcategory/:id',categorycontroller.editCategory);
adminRoute.get('/product',auth.isLogin,productcontroller.loadProduct);
adminRoute.get('/product/addproduct',auth.isLogin,productcontroller.addProduct);
adminRoute.post('/product',upload.array('images',3),productcontroller.insertProduct);
adminRoute.get('/product/deleteproduct/:id',auth.isLogin,productcontroller.deleteProduct);
adminRoute.get('/product/editproduct/:id',auth.isLogin,productcontroller.editProduct);
adminRoute.post('/product/editproduct/:id',upload.array('images',3),productcontroller.UpdateProduct)
adminRoute.get('/user',auth.isLogin,adminusercontroller.loadUser);
adminRoute.get('/user/blockuser/:id',auth.isLogin,adminusercontroller.blockUser)
adminRoute.get('/user/unblockuser/:id',auth.isLogin,adminusercontroller.unblockuser);







adminRoute.get('*',function(req,res){
    res.redirect('/admin');
})


module.exports=  adminRoute;
