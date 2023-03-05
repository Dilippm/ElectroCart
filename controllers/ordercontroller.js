const Product = require('../models/productData');
const User = require('../models/userData');
const Order = require('../models/orderData');

const loadCheckOut = async (req, res) => {
  try {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      const userdetails = await User.findOne({ _id: userId });
      const data = await User.findOne({ _id: userdetails._id });
      const use = await User.findById({ _id: userId });
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
};



const successLoad = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      let method = req.body.test
      if (method == "COD") {
        const userid = await User.findOne({ _id: req.session.user_id })
        const id = userid
        const orders = req.body
        const orderDetails = [];
        const productId = req.body.proId
        orders.product = orderDetails;
        if (!Array.isArray(orders.proId)) {
          orders.proId = [orders.proId]
        }
        if (!Array.isArray(orders.proQ)) {
          orders.proQ = [orders.proQ]
        }
        if (!Array.isArray(orders.qntyPrice)) {
          orders.qntyPrice = [orders.qntyPrice]
        }
        for (let i = 0; i < orders.proId.length; i++) {
          const productsId = orders.proId[i]
          const quantity = orders.proQ[i]
          const singleTotal = orders.qntyPrice[i]
          orderDetails.push({ productId: productsId, quantity: quantity, singleTotal: singleTotal })
        }

        // Update the product quantity in the Product collection
        for (let i = 0; i < orderDetails.length; i++) {
          const product = await Product.findById(orderDetails[i].productId);
          product.quantity -= orderDetails[i].quantity;
          await product.save();
        }

        const addressId = req.body.address; // get the selected address ID from the form
        const userData = await User.findById(id);
        const addressDetails = userData.address.find(address => address._id == addressId); // find the selected address details from the user's address array

        const order = new Order({
          userId: id,
          product: orders.product,
          total: orders.total,
          deliveryAddress: addressDetails, // set the delivery address to the selected address details
          paymentType: orders.test
        })
        const saveData = await order.save()

        const removing = await User.updateOne({ _id: req.session.user_id }, {
          $pull: {
            cart: { product: { $in: productId } }
          },
          $set: { totalPrice: 0 }
        })

        const userdetails = await User.findOne({ _id: req.session.user_id })
        res.render('successpage', { userdetails: userdetails })
      }
    } else {
      res.redirect('/login')
    }
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  loadCheckOut,
  successLoad
}