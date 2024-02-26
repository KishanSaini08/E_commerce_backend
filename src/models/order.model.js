import mongoose from "mongoose";
import { user } from "./user.model.js";

const Schema = new mongoose.Schema(
    {
       
       shippingInfo:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        pincode:{
            type:Number,
            required:true,
        },
       },

       user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
       subTotel:{
        type:Number,
        required:true,
       },
       tax:{
        type:Number,
        required:true,
       },
       shippingCharges:{
        type:Number,
        required:true,
       },
       discount:{
        type:Number,
        required:true,
       },
       totel:{
        type:Number,
        required:true,
       },

       status:{
        type:String,
        enum:["processing", "shipped" , "delivered"],
        default:"processing",
    },

    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productID: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                // required:true,
            }
        }
    ]
},
        
    {
        timestamps: true,
    }
);


 export const Order = mongoose.model("Order", Schema);



