import { json } from "express"
import { TryCatch } from "../middleware/erroe.js"
import { Invlidatecache, reduceStock } from "../utils/feature.js"
import ErrorHandler from "../utils/utility_class.js";
import { Order } from "../models/order.model.js";
import { MyCache } from "../app.js";
import { user } from "../models/user.model.js";

export const myOrders = TryCatch(async(req,res,next)=>{
   
   const { id} = req.query;

   const key = `my-orders-${id}`;

   let orders = []

   if(MyCache.has(key)) orders = JSON.parse(MyCache.get(key));

   else{
    orders = await Order.find({user:id});
    console.log(orders)
    MyCache.set(key, JSON.stringify(orders));
   }

   return res.status(200).json({
    success:true,
    orders,
   })
})


export const AllOrders = TryCatch(async(req,res,next)=>{
    
    const key = `All-orders`;
 
    let orders = []
 
    if(MyCache.has(key)) orders = JSON.parse(MyCache.get(key));
 
    else{
     orders = await Order.find()
    //  .populate("");
     MyCache.set(key, JSON.stringify(orders));
    }
 
    return res.status(200).json({
     success:true,
     orders,
    })
 })


 export const getsingleOrders = TryCatch(async(req,res,next)=>{
     const {id} = req.params;
    const key = `orders${id}`;
 
    let order
 
    if(MyCache.has(key)) order = JSON.parse(MyCache.get(key));
 
    else{
        order = await Order.findById(id)
    //  .populate("user","name");
    console.log(order)

    if(!order)
    return next(new ErrorHandler("Order not found"));
     MyCache.set(key, JSON.stringify(order));
    }
 
    return res.status(200).json({
     success:true,
     order,
    })
 })




 
export const neworder = TryCatch(async(req,res,next)=>{
    const {shippingInfo , orderItems , user ,subTotel , tax , shippingcharges , discount , totel}= req.body
    if(!shippingInfo || !orderItems || !user || !subTotel || !tax  || !totel )
    return next(new ErrorHandler("please add all fileds" ,400));
   const order = await Order.create({
        shippingInfo , 
        orderItems , 
        user ,
        subTotel ,
        tax ,
        shippingcharges,
        discount,
        totel ,
    })


    await reduceStock(orderItems);
   invlidatecache(
    {product:true , order:true , admin:true , userId:user , productId:order.orderItems.map(i=>i.productId)});

   return res.status(201).json({
    success:true,
    message:"order placed succesfully",
   })
})




export const ProcessingOrder = TryCatch(async(req,res,next)=>{
    
    const {id} = req.params;

    const order = await Order.findById(id);

    if(!order) 
    return next(new ErrorHandler("Order Not Found" , 404))

switch(order.status){
    case "processing":
    order.status = "shipped";
    break;
    case "shipped":
    order.status = "delivered";
    break;
    case "shipped":
        order.status = "delivered";
        break;
}

  await order.save()
    invlidatecache({product:false , order:true , admin:true , userId:order.user , orderId:order._id});

   return res.status(200).json({
    success:true,
    message:"order processed succesfully",
   })
})


export const DeleteOrder = TryCatch(async(req,res,next)=>{
    
    const {id} = req.params;
    const order = await Order.findById(id);

    if(!order) 
    return next(new ErrorHandler("Order Not Found" , 404))



  await order.deleteOne()

   

  invlidatecache({product:false , order:true , admin:true , userId:order.user , orderId:order._id});

   return res.status(200).json({
    success:true,
    message:"order deleted succesfully",
   })
})