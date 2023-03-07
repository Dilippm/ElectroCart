const admin = require('../models/adminData');
const Product = require('../models/productData');
const User = require('../models/userData');
const Order = require('../models/orderData');
const Category= require('../models/categoryData');
const moment = require('moment');

const adminRegister = async (req, res) => {
  try {
    res.render('adminlogin')

  } catch (error) {
    console.log(error.message)
  }
}

const verifylogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const adminData = await admin.findOne({ email: email, password: password });

    if (adminData) {

      req.session.admin_id = adminData._id;
      res.redirect('/admin/dashboard')
    } else {
      res.render('adminlogin', { message: "invalid email or password" })
    }

  } catch (error) {
    console.log(error.message)
  }
}
const loadDashboard = async (req, res) => {
  try {
    const categoryData = await Category.find({});
    const productData = await Product.find({}).populate('category').exec();

    const salesCount = await Order.find({}).count();
    const totalUsers = await User.find({}).count();
    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total' },
        },
      },
    ]);
   
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const usersForTheLastWeek = await User.find({ date: { $gte: lastWeek } });
    const salesChart = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          sales: { $sum: '$total' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 7,
      },
    ]);

    const date = salesChart.map((item) => {
      return item._id;
    });

    const sales = salesChart.map((item) => {
      return item.sales;
    });

    const pending = await Order.find({ status: 'Pending' }).count();
    const processing = await Order.find({ status: 'Processing' }).count();
    const delivered = await Order.find({ status: 'Delivered' }).count();
    const shipped = await Order.find({ status: 'Shipped' }).count();
    const cancelled = await Order.find({ status: 'Cancelled' }).count();
    const UPI = await Order.find({ paymentType: 'UPI' }).count();
    const COD = await Order.find({ paymentType: 'COD' }).count();

    res.render('dashboard', {
      totalUsers,
      salesCount,
      productData,
      categoryData,
      weeklyRevenue,
      
      usersForTheLastWeek,
      processing,
      pending,
      delivered,
      shipped,
      cancelled,
      UPI,
      COD,
      sales,
      date,
      moment,
    });
  } catch (error) {
    console.log(error.message);
  }
};


const adminLogout = async (req, res) => {
  try {
    req.session.admin_id = null
    res.redirect('/admin')
  } catch (error) {
    console.log(error.message)
  }
}

const viewsalesReport = async (req, res) => {
  try {
    const orders = await Order
      .find()
      .populate({ path: "product.productId", select: "productName price" });

    // Create a new object to store total sales for each product by month
    const salesByMonthAndProduct = {};

    // Iterate over each order and update salesByMonthAndProduct with the total
    // sales for each product by month
    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      const month = orderDate.toLocaleString("default", { month: "long" });

      order
        .product
        .forEach((product) => {
          const productName = product.productId.productName;
          const productSalesTotal = product.quantity * product.productId.price;

          if (!(month in salesByMonthAndProduct)) {
            salesByMonthAndProduct[month] = {};
          }

          if (productName in salesByMonthAndProduct[month]) {
            salesByMonthAndProduct[month][productName].quantitySold += product.quantity;
            salesByMonthAndProduct[month][productName].totalSales += productSalesTotal;
          } else {
            salesByMonthAndProduct[month][productName] = {
              quantitySold: product.quantity,
              totalSales: productSalesTotal
            };
          }
        });
    });

    res.render("salesreport", { salesByMonthAndProduct });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminRegister,
  verifylogin,
  loadDashboard,

  adminLogout,
  viewsalesReport
}
