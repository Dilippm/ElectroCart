const admin =require('../models/adminData')

const adminRegister=async(req,res)=>{
try{
    res.render('adminlogin')
    
}
catch(error){
console.log(error.message)
}
}

const verifylogin=async(req,res)=>{
    try {
        const email=req.body.email
        const password=req.body.password
        
        
      
        const adminData = await admin.findOne({email:email,password:password});
        
        if(adminData){
           

                req.session.admin_id=adminData._id;
                res.redirect('/admin/dashboard')
            }else{
                res.render('adminlogin',{message:"invalid email or password"})
            }
        
        
    } catch (error) {
        console.log(error.message)
    }
}
const loadDashboard=async(req,res)=>{
   try {
    res.render('dashboard')
    
   } catch (error) {
    console.log(error.message)
   }

}

const adminLogout=async(req,res)=>{
try {
    req.session.destroy()
    res.redirect('/admin')
} catch (error) {
    console.log(error.message)
}
}


module.exports={
    adminRegister,
   verifylogin,
    loadDashboard,
    
    adminLogout
}

