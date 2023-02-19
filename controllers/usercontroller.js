const user = require('../models/userData');
const bcrypt =require('bcrypt');

const securePassword =async(password)=>{
    try {
      const passwordHash= await bcrypt.hash(password,10);
      return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

// home page get(guest)
const loadHome = async (req, res) => {
    try {
        res.render('homepage');
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
// login page  post
const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email
        const password=req.body.password
        
        
      
        const userData = await user.findOne({email:email});
        
        if(userData){

          const passwordmatch= await bcrypt.compare(password,userData.password);
          if(passwordmatch){
            req.session.user_id=userData.id;
            res.redirect('/');

          }else{
            res.render('login',{message:"invalid email or password"});
          }
           

               
                
            }else{
                res.render('login',{message:"invalid email or password"});
            }
        
        
    } catch (error) {
        console.log(error.message)
    }
}
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
                mobile: req.body.mobile
            });
            const userData = await newUser.save();
            if (userData) {
                res.redirect('/')
            } else {
                res.render('userregister', { message: "Registration failed" });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadHome,
    loadLogin,
    loadRegister,
    uploadRegister,
    verifyLogin,
    
   
}