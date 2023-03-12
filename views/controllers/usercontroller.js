const user = require('../models/userData');
const product = require('../models/productData');
const category = require('../models/categoryData');

const bcrypt = require('bcrypt');

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
        console.log("iam guest");
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
            console.log(data);
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
const loadCart = async (req, res) => {
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
      await userData.save();
  
      // Calculate the new cart total price
      const totalPrice = userData.cart.item.reduce((total, item) => {
        return total + item.price * item.qty;
      }, 0);
  
      // Return the new total price in the response
      res.json({ totalPrice });
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
    loadCart,

    addToCart,
    deleteCart,
    editQty



}