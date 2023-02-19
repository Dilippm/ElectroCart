const user=require('../models/userData');

const loadUser = async (req, res) => {
    try {
      const userdata = await user.find({});
      res.render('adminuserlist', { userData: userdata });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  const deleteUser =async(req,res)=>{
    try {
        const id=req.params.id;
        await user.deleteOne({_id:id});
        res.redirect('/admin/user')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadUser,
   deleteUser
}