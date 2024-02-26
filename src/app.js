import express  from "express";
import { connectDB } from "./utils/feature.js";
import { errorMiddleWare } from "./middleware/erroe.js";
import NodeCache from "node-cache";
import {config} from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";

//import routing
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import dashboardRoute from "./routes/state.route.js";


config({ path:"./.env"});



const Port = process.env.PORT || 4000
const mongoUri = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";


connectDB(mongoUri);

export const  stripe = new Stripe(stripeKey)
export const MyCache =new NodeCache()

const app =express();


app.use(express.json());
app.use(morgan("dev"));

app.get("/" ,(req , res ) =>{
  res.send("API WORKING WITH /API/V1")
})

app.use("/api/v1/user" , userRoute)
app.use("/api/v1/product" , productRoute)
app.use("/api/v1/order" , orderRoute)
app.use("/api/v1/payment" , paymentRoute)
app.use("/api/v1/dashboard" , dashboardRoute)

app.use("/upload" , express.static("upload"));
app.use(errorMiddleWare)

app.listen( Port ,()=> {
    console.log(`Express  is working on http://localhost:${Port}`)
})