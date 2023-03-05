const user= require('../models/userData')
const product= require('../models/productData')
const category= require('../models/categoryData')
const order= require('../models/orderData')
const ads= require('../models/adsData')

require('dotenv').config();
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountsid, authtoken);

const bcrypt = require('bcrypt');
const { request } = require('../routes/userRoute');

//bcrypt password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

// home page get

const guest = async (req, res) => {
    try {
        
        const data = await product.find();
        const cat = await category.find();
        const banners = await ads.find({})
        const users = false;
        res.render('homepage', { data, cat, users,banners })

    } catch (error) {
        console.log(error.message);
    }
}
const userHome = async (req, res) => {
    try {
        if (req.session.user_id) {
            const id = req.session.user_id
            const users = true;
            const data = await product.find();
            
            const cata = await category.find();
            const use = await user.findOne({ _id: id });
            const banners = await ads.find({})

            res.render('homepage', { data, cata, use, users, banners});

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

// const uploadRegister = async (req, res) => {
//     try {
//         const spassword = await securePassword(req.body.password);
//         const existingUser = await user.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
//         if (existingUser) {
//             res.render('userregister', { message: "User already exists with this email or mobile number" });
//         } else {
//             const newUser = new user({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: spassword,
//                 mobile: req.body.mobile,

//             });
//             const userData = await newUser.save();
//             if (userData) {
//                 req.session.user_id = userData.id;
//                 res.redirect('/userhome')
//             } else {
//                 res.render('userregister', { message: "Registration failed" });
//             }
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

//verify signup

const verifySignup = async (req, res, next) => {

  req.session.userdata = req.body
  const found = await user.findOne({ name: req.body.name })
  if (found) {
    res.render('userregister', { message: "username already exist ,try another" });
  }
  else if (req.body.name == ''  || req.body.email == '' || req.body.password == '' || req.body.mobile == '') {
    res.render('signup', { message: "All fields are required" });
  } else {
    // console.log('body'+req.body)
    phonenumber = req.body.mobile;
    try {

      const otpResponse = await client.verify.v2
        .services('VA5d6b573510fb1b3d0f42fc7b41df4025')
        .verifications.create({
          to: `+91${phonenumber}`,
          channel: 'sms',
        });
      res.render('otppage')
    } catch (error) {
     console.log(error.message);
    }
  }
}

//verifying otp
const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  try {
    req.session.user
    const details = req.session.userdata;

    const verifiedResponse = await client.verify.v2
      .services('VA5d6b573510fb1b3d0f42fc7b41df4025')
      .verificationChecks.create({
        to: `+91${details.mobile}`,
        code: otp,
      })
    console.log('details' + details)
    if (verifiedResponse.status === 'approved') {
      details.password = await bcrypt.hash(details.password, 10)
      const userdata = new user({
        name: details.name,
       // lastname: details.lastname,
        email: details.email,
       // username: details.username,
        password: details.password,
        mobile: details.mobile

      })
      const userData = await userdata.save();
      // console.log()
      // console.log("sss" + userData)
      req.session.user = userData
      if (userData) {
        res.redirect('/userhome');
      } else {
        res.render('otppage', { message: "wrong otp" })
      }

    } else {
      res.render('otppage', { message: "wrong otp" })
    }
  } catch (error) {
    console.log(error.message);
  }
}


// user logout 
const userLogout = async (req, res) => {
    try {
        req.session.user_id =null;
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }

}

const productView = async (req, res) => {
  try {
      let id = req.params.id;
      const productData = await product.findOne({ _id: id }).populate('category');
      const users = Boolean(req.session.user_id);
      const use = await user.findOne({ _id: req.session.user_id });

      res.render('productview', { productdetails: productData, users, use });
  } catch (error) {
      console.log(error.message);
  }
}


const profile= async(req,res)=>{
    try {
        
       
       
        if (req.session.user_id) {
            const users = true;
            const userid = req.session.user_id;
            const use= await user.findOne({ _id:userid })
               const userdetail = await user.findOne({ _id: userid})
      
            
            res.render('userprofile', { userdetails: userdetail,users,use })
          } else {
            res.redirect('/login')
          }
        
    } catch (error) {
        console.log(error.message);
    }
}

const editUser = async(req,res)=>{
    
    const users = true;
    const userid = req.session.user_id;
    const use = await user.findById({ _id:userid});
        //       const id = req.params.id
    //   const userData =await user.findById({ _id:id })
    res.render('edit-user',{users,use})


    
}
const updateUser = async(req,res)=>{
    try {
       
        if (req.session.user_id) {
          const update = await user.updateOne({ _id:req.session.user_id}, {
            $set: {
              name: req.body.name,
            
              email: req.body.email,
              mobile: req.body.mobile,
              
            }
          })
          res.redirect('/userhome')
        } else {
          res.redirect('/login')
        }
      } catch (error) {
        next(error);
      }
}

const addressView = async (req, res) => {
    
   
    try {
        if (req.session.user_id) {
            const users = true;
          const userid = req.session.user_id;
          const userdetails = await user.findOne({ _id:userid})
          const data = await user.findOne({ _id: userdetails._id })
          const use = await user.findById({ _id:userid});
          
    
          res.render('address', { userdetails: userdetails, datas: data,users,use})
        } else {
          res.redirect('/login')
        }
      } catch (error) {
       console.log(error.message);
      }
    
  }
  

const addAddress =async(req,res)=>{
    try {
        const users = true;
        const userid = req.session.user_id;
    const use = await user.findById({ _id:userid});
        res.render('addAddress',{users,use})
    } catch (error) {
        console.log(error.message);
    }
}

//insert address
const insertAddress = async (req, res) => {
    try {
      
      if (req.session.user_id) {
  
  
      
        const addressinserted = await user.updateOne({ _id: req.session.user_id}, {
          $push: {
            address: {
              name:req.body.name,
              houseName: req.body.hname,
              street: req.body.street,
              district: req.body.district,
              country: req.body.country,
              state: req.body.state,
              pincode: req.body.pincode,
              phone: req.body.number
            }
          }
        })
        res.redirect('/address')
      } else {
        res.redirect('/login')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // edit address
  const editaddress=async(req,res)=>{
    try {
        if (req.session.user_id) {
            const users = true;
            const id = req.params.id
            const userdetails = req.session.user_id;
            const use = await user.findById({ _id:userdetails});
            const edit = await user.findOne({ _id:userdetails, "address._id": id }, { "address.$": 1 })
           
         res.render('editaddress',{edit: edit,userdetails: userdetails,use,users });
      }else{
        res.redirect('/login')
      }
        
    } catch (error) {
        console.log(error.message);
    }
    
 

} 
//edited address inserting
const editedAddress = async (req, res) => {
    try {
      if (req.session.user_id) {
        id = req.params.id;
  
         await user.updateOne({ _id: req.session.user_id, "address._id": id },
          {
            $set: {
              "address.$": req.body
            }
          })
        res.redirect('/address')
      } else {
        res.redirect('/login')
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  

const removeAddress = async(req,res)=>{
    try {
        if(req.session.user_id){
            const id = req.params.id;
            const userid =req.session.user_id;
            const removeinserted = await user.updateOne({ _id: userid }, {
                $pull: {
                  address: {
                    _id: id
                  }
                }
              })
              res.redirect('/address')

        }else{
            res.redirect('/login');

        }
    } catch (error) {
        console.log(error.message);
    }
}

const viewOrders = async (req, res) => {
  try {
    if (req.session.user_id) {
      const users = true;
      const userId = req.session.user_id;
      const userDetails = await user.findOne({ _id: userId });
      const orderDetails = await order.find({ userId: userId }).populate('product.productId');
      res.render('orderlist', {
        users,
        use: await user.findById(userId),
        userdetails: userDetails,
        orderDetail: orderDetails
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    // Find the order to cancel
    const orderToCancel = await order.findOne({ _id: orderId }).populate('product.productId');

    // Add the "Cancelled" status to the order status array
    orderToCancel.orderStatus.push({ status: 'Cancelled', date: new Date() });
    await orderToCancel.save();

    // Update the status of the order to "Cancelled"
    await orderToCancel.updateOne({ status: 'Cancelled' });
    await orderToCancel.save();

    

    res.send('Order cancelled successfully');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error cancelling order');
  }
};

const orderDetails = async(req,res)=>{
  try {
    if (req.session.user_id) {
      const orderId = req.params.id;
      const users = true;
      const userId = req.session.user_id;
      
      const orderDetails = await order.findById(orderId).populate('product.productId');
      res.render('orderdetails', {
        users,
        use: await user.findById(userId),
       
        orderDetail: orderDetails
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }

}




module.exports = {
    guest,
    userHome,
    
    loadLogin,
    loadRegister,
   
    verifySignup,
    verifyOtp,
    verifyLogin,
    userLogout,
    productView,
   
    profile,
    editUser,
    updateUser,
    addressView,
    addAddress,
    insertAddress,
    editaddress,
    editedAddress,
    removeAddress,
  viewOrders,
  cancelOrder,
  orderDetails,
 
   



}