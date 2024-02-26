import  express from "express";
import { adminonly } from "../middleware/auth.js";
import { createPaymentIntent, AllCoupons, ApplyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.controler.js";


const app = express.Router();
// /api/v1/payment/create   

app.post("/create"  ,createPaymentIntent);
// /api/v1/payment/discount   
app.get("/discount"  ,ApplyDiscount);

// /api/v1/payment/coupon/new   
app.post("/coupon/new" , adminonly ,newCoupon);

// /api/v1/payment/coupon/all   
app.get("/coupon/all" , adminonly, AllCoupons);

// /api/v1/payment/coupon/:id   
app.delete("/coupon/:id" ,adminonly , deleteCoupon);



export default app;



