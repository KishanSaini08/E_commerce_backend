import mongoose from "mongoose";


const Schema = new mongoose.Schema(
    {
       
        name:{
            type: String,
            required: [true ," Please Enter Name"],
        },
        photo:{
            type: String,
            required: [true ," Please Enter photo"],
        },
        price:{
            type: Number,
            required: [true ," Please Enter  price"],
        },
        stock:{
            type: Number,
            required: [true ," Please Enter stock"],
        },
        category:{
            type: String,
            required: [true ," Please Enter categroy"],
            trim: true,
        },
        
    },
        
    {
        timestamps: true,
    }
);


 export const product = mongoose.model("product", Schema);



