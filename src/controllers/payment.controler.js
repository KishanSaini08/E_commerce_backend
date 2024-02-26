import { TryCatch } from "../middleware/erroe.js";
import ErrorHandler from "../utils/utility_class.js";
import { Coupon  } from "../models/coupon.model.js";
import { stripe } from "../app.js";



export const createPaymentIntent = TryCatch(async(req,res,next)=>{

    const { amount}= req.body

    if( !amount )
    return next(new ErrorHandler("please enter  amount" , 400))

    const PaymentIntent = await stripe.paymentIntents.create({
        amount:Number(amount)*100,
        currency:"inr"
    })


    return res.status(201).json({
        success:true,
       clientsecret:PaymentIntent.client_secret,
    })

})


export const newCoupon = TryCatch(async(req,res,next)=>{

    const { coupon , amount}= req.body


    if(!coupon || !amount )
    return next(new ErrorHandler("please enter both coupon and amount" , 400))

    await Coupon.create({code:coupon, amount });

    return res.status(201).json({
        success:true,
        message:`coupon ${coupon}  created successfully`
    })

})


export const ApplyDiscount = TryCatch(async(req,res,next)=>{

    const { coupon}= req.query;

    const discount = await Coupon.findOne({code:coupon});

    if(!discount)
    return next(new ErrorHandler("INVLID COUPON CODE" , 400));

    return res.status(200).json({
        success:true,
        discount:discount.amount,
    })

})

export const AllCoupons = TryCatch(async(req,res,next)=>{

    const coupons = await Coupon.find({});

  return res.status(200).json({
        success:true,
        coupons,
    })

})

export const deleteCoupon = TryCatch(async(req,res,next)=>{
   
    const {id} = req.params;
     const coupon = await Coupon.findByIdAndDelete(id);

     if(!coupon)
     return  next(new ErrorHandler("Invlid Coupon Id" , 400))

  return res.status(200).json({
        success:true,
        message:`coupon  ${coupon?.code}deleted successfully`,
    })

})






