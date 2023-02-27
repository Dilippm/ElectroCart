const order=require('../models/orderData');

const viewOrder=async(req,res)=>{
    try {
        const ordredetails = await order.find({});
        const orders=[];
        const users=[];
        if(ordredetails.length>0){
            for(let i=0;i<ordredetails.length;i++){
                const currentOrder = ordredetails[i];
                const populatedOrder = await order.findById(currentOrder._id).populate('product.productId').populate('userId');
                orders.push(populatedOrder);
                users.push(populatedOrder.userId);
            }
           
        }
        res.render('adminorder', {order: orders, user: users, orderDetail: ordredetails});
    } catch (error) {
        console.log(error.message);
    }
}
const dropdown = async (req, res) => {
    try {
      const orderId = req.body.orderId;
      const status = req.body.status;
  
      await order.updateOne({ orderId: orderId }, { $set: { status: status } });
  
      res.redirect('/admin/order');
    } catch (error) {
      console.log(error.message);
    }
  };
  
module.exports={
    viewOrder,
    dropdown
}