import mongoose from "mongoose";
import { MyCache } from "../app.js";
import { product as productModel} from "../models/product.model.js";
import ErrorHandler from "./utility_class.js";
import { Order } from "../models/order.model.js";

export const connectDB =(uri)=>{
    mongoose.connect(uri,{
        dbName:"Grocery_2024",
    })
    .then ((c)=>console.log(`DB is connected to ${c.connection.host}`))
    .catch((e)=>console.log(e))
};


export const Invlidatecache = ({
    product, order , admin , userId , orderId , productId}) =>{
        if(product){
            const productkeys =["latest-products","categroies" , "all-products" ];

            if(typeof productId ==="string") productkeys.push(`product-${productId}`)

            if(typeof productId ==="object")
                productId.forEach((i)=>productkeys.push(`product-${i}`));
            
            MyCache.del(productkeys)
        }


        if(order){
            const orderKeys =["All-orders", `my-orders-${userId}`, `orders${orderId}`];
                MyCache.del(orderKeys)
            
            
        }
        if(admin){
                MyCache.del(["admin-stats" ,"admin-pie-chart","admin-bar-chart" , "admin-line-chart" ])
        }
    }


    export const reduceStock =async(orderItems)=>{
        for(let i=0 ; i<orderItems.length; i++){
            const order = orderItems[i];
             const product = await productModel.findById(order.productID);
             if(!product) throw new ErrorHandler("product Not Found")

             product.stock -= order.quantity;
             await product.save()
        }
    }



    export  const calculatePercentage = (thisMonth , lastMonth )=>{
        
        if(lastMonth===0) return thisMonth*100;

        const percent = (thisMonth / lastMonth)*100
        return percent.toFixed(0);

    }



    export const getInventories =  async({categories , productsCount})=>{
        const categorycountpromise = categories.map((category)=>
        productModel.countDocuments({category})
        );
      
        const categorioscount = await Promise.all(categorycountpromise);
      
        const categoryCount = []
      
        categories.forEach((category , i )=>{
          categoryCount.push({
              [category] :Math.round(( categorioscount[i] / productsCount)*100),
          });
        });

        return categoryCount;
    }




    export const getChartData = ({length , docarr , property })=>{

        const today = new Date();
        const data= new Array (length).fill(0);



        docarr.forEach((i)=>{
           const creationDate= i.createdAt;
           const monthDiffrent = (today.getMonth() - creationDate.getMonth() + 12)%12 ;
      
           if(monthDiffrent < length){

            if(property){
                data[length-monthDiffrent-1]  += i[property];
            }
            else{
                data[length-monthDiffrent-1]  +=  1;

            }



           }
        })

        return data;

    }