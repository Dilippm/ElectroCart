const user = require('../models/userData');
const product = require('../models/productData');
const category = require('../models/categoryData');
const order= require('../models/orderData')

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
        const users = false;
        res.render('homepage', { data, cat, users })

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

            res.render('homepage', { data, cata, use, users });

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
        const spassword = await securePassword(req.body.password);
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
const userLogout = async (req, res) => {
    try {
        req.session.user_id = null
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }

}

const productView = async (req, res) => {
    try {
        if (req.session.user_id) {
            const userid = req.session.user_id;
            const users = true;
            const use = await user.findOne({ _id: userid });

            const id = req.params.id;
            productData = await product.findOne({ _id: id })
            res.render('productview', { productdetails: productData, users, use });
        } else {
            let id = req.params.id;
            const users = false;
            productData = await product.findOne({ _id: id })

            res.render('productview', { productdetails: productData, users })

        }
    } catch (error) {
        console.log(error.message);
    }
}
/*const loadCart = async (req, res) => {
    try {
        if (req.session.user_id) {
            const users = true;
            const userid = req.session.user_id;
            const use = await user.findById({ _id: userid });
            const completeUser = await use.populate('cart.item.productId');
            const cartProducts = completeUser.cart; // define cartProducts here
            res.render('cart', { id: userid, cartProducts, users, use });
            console.log(cartProducts); // cartProducts is now defined 
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addToCart = async (req, res) => {
    try {
        const productId = req.params.id
        const userid = req.session.user_id;
        if (userid) {
            const users = true;
            const use = await user.findById({ _id: userid })
            const productData = await product.findById({ _id: productId })
            await use.addToCart(productData, users, use) 
            res.redirect('/cart')
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const editQty = async (req, res) => {
    try {
      const id = req.query.id;
      const qty = parseInt(req.body.qty);
      const userSession = req.session;
      const userData = await user.findById(userSession.user_id);
  
      // Find the index of the cart item with the given ID
      const itemIndex = userData.cart.item.findIndex((item) => item.productId == id);
  
      if (itemIndex < 0) {
        // The item is not in the cart, return an error response
        return res.status(400).json({ error: 'Item not found in cart' });
      }
  
      // Update the quantity of the item and save the user data
      userData.cart.item[itemIndex].qty = qty;
  
      // Update the total price of the cart
      userData.cart.totalPrice = userData.cart.item.reduce((total, item) => {
        return total + item.price * item.qty;
      }, 0);
  
      await userData.save();
  
      // Return the new total price in the response
      res.json({ totalPrice: userData.cart.totalPrice });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  

const deleteCart = async (req, res) => {
    try {
        const productId = req.params.id

        const userData = await user.findById({ _id: req.session.user_id })
        userData.removeFromCart(productId)
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }
}
*/
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

/*const checkOut = async (req, res) => {
    try {
      if (req.session.user_id) {
        const userId = req.session.user_id;
        const userdetails = await user.findOne({ _id: userId });
        const data = await user.findOne({ _id: userdetails._id });
        const use = await user.findById({ _id: userId });
        const completeUser = await use.populate("cart.product");
        const cartProducts = completeUser.cart;
        const addressDetail = data.address; // get the address array from data
        
        res.render("checkout", {
          userdetails: userdetails,
          datas: data,
          users: true,
          use: use,
          cartProducts: cartProducts,
          addressDetails: addressDetail // pass addressDetails to the template
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };*/
  
 
  
module.exports = {
    guest,
    userHome,
    
    loadLogin,
    loadRegister,
    uploadRegister,
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
   
   



}