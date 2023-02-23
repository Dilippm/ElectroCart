

const islogin =async(req,res,next)=>{
    try {
        if(req.session.user_id){
          

        }else{
           return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const islogout =async(req,res,next)=>{
  
        try {
            if(req.session.user_id){
                return res.redirect('/userhome');
    
            }
            next();
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    islogin,
    islogout
}