const admin= require('../models/adminData');
const Product= require('../models/productData');

const Order= require('../models/orderData');

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
    req.session.admin_id= null
    res.redirect('/admin')
} catch (error) {
    console.log(error.message)
}
}

const viewsalesReport = async (req, res) => {
    try {
      const orders = await Order.find().populate({
        path: "product.productId",
        select: "productName price",
      });
  
      // Create a new object to store total sales for each product by month
      const salesByMonthAndProduct = {};
  
      // Iterate over each order and update salesByMonthAndProduct with the total sales for each product by month
      orders.forEach((order) => {
        const orderDate = new Date(order.date);
        const month = orderDate.toLocaleString("default", { month: "long" });
  
        order.product.forEach((product) => {
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
              totalSales: productSalesTotal,
            };
          }
        });
      });
  
      res.render("salesreport", {
        salesByMonthAndProduct,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  

module.exports={
    adminRegister,
   verifylogin,
    loadDashboard,
    
    adminLogout,
    viewsalesReport
}

