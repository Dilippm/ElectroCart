const user = require('../models/userData');
const product=require('../models/productData');
const category=require('../models/categoryData');

const bcrypt =require('bcrypt');

//bcrypt password
const securePassword =async(password)=>{
    try {
      const passwordHash= await bcrypt.hash(password,10);
      return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

// home page get

const guest =async(req,res)=>{
    try {
        console.log("iam guest");
        const data=await product.find();
        const cat =await category.find();
        const users=false;
        res.render('homepage',{data,cat,users})

    } catch (error) {
        console.log(error.message);
    }
}
const userHome = async(req,res)=>{
    try {if(req.session.user_id){
        const id=req.session.user_id
        const users=true;
        const data =await product.find();
        console.log(data);
        const cata=await category.find();
        const use =await user.findOne({_id:id});
        
        res.render('homepage',{data,cata,use,users});

    }
        
    } catch (error) {
        console.log(error.message);
    }
}

// login page get
const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}
// login page post
  const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await user.findOne({ email: email });
        if (userData) {
            if (userData.status === true) {
                res.render('login', { message: 'Your account has been blocked.' });
                return;
            }
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData.id;
                res.redirect('/userhome');
                return;
            }
        }
        res.render('login', { message: 'Invalid email or password.' });
    } catch (error) {
        console.log(error.message);
    }
};


//register page get
const loadRegister = async (req, res) => {
    try {
        res.render('userregister');
    } catch (error) {
        console.log(error.message);
    }
}
//register page post

const uploadRegister = async (req, res) => {
    try {
        const spassword= await securePassword(req.body.password);
        const existingUser = await user.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
        if (existingUser) {
            res.render('userregister', { message: "User already exists with this email or mobile number" });
        } else {
            const newUser = new user({
                name: req.body.name,
                email: req.body.email,
                password: spassword,
                mobile: req.body.mobile,
               
            });
            const userData = await newUser.save();
            if (userData) {
                req.session.user_id = userData.id;
                res.redirect('/userhome')
            } else {
                res.render('userregister', { message: "Registration failed" });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
// user logout 
const userLogout =async(req,res)=>{
    try {
        req.session.user_id=null
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }

}
/*const productView = async (req, res) => {

    try {
        if (req.session.user_id) {
            const id = req.session.user_id;
            const singleproduct = await product.find({ _id: req.params.id });
            const users = true;
            const use = await user.findOne({ _id: id });
            res.render('productview', { singleproduct, users, use })

        } else {
            const singleproduct = await product.find({ _id: req.params.id });
            const users = false;

            res.render('productview', { singleproduct, users })

        }

    } catch (error) {
        console.log(error.message);
    }


}*/
const productView =async(req,res)=>{
    try {
        if (req.session.user_id) {
           const userid = req.session.user_id;
            const users = true;
            const use = await user.findOne({ _id: userid });
           
       const id=req.params.id;
        productData=await product.findOne({_id:id})
        res.render('productview',{productdetails:productData,users,use});
        }else{
            let id=req.params.id;
            const users = false;
            productData=await product.findOne({_id:id})

            res.render('productview', { productdetails:productData, users })

        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadCart =async(req,res)=>{
    try {
        if(req.session.user_id){
            res.render('cart');

        }else{
            res.redirect('/login');
        }

    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    guest,
    userHome,
    //loadHome,
    loadLogin,
    loadRegister,
    uploadRegister,
    verifyLogin,
    userLogout,
    productView,
    loadCart
 
    
   
}