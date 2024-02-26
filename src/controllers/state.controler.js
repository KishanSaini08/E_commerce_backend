import { TryCatch } from "../middleware/erroe.js";
import{ MyCache} from "../app.js"
import { product } from "../models/product.model.js";
import { user } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/feature.js";


export const getDashBoardState = TryCatch(async(req , res , next)=>{

    let stats ={} ;

    const key = "admin-stats";

    if(MyCache.has(key))
    stats = JSON.parse(MyCache.get(key));

    else{

        const today = new Date();
        const SixMonthAgo = new Date();

        SixMonthAgo.setMonth(SixMonthAgo.getMonth()-6);

        const thisMonth ={
          start:new Date(today.getFullYear(), today.getMonth() , 1),
          end:today,
        }
        // console.log(getFullYear())

        const lastMonth ={
            start:new Date(today.getFullYear(), today.getMonth()-1, 1),
            end:new Date(today.getFullYear(), today.getMonth()  , 0),
  
          }

          const thisMonthProductspromise =  product.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end,

            }
            
          });

          const lastMonthProductspromise =  product.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end,

            }
          });



          const thisMonthUserspromise =  user.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end,

            }
          });

          const lastMonthUserspromise =  user.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end,

            }
          });

          
          const thisMonthOrderspromise = Order.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end,

            }
          });

          const lastMonthOrderspromise =  Order.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end,

            }
          });

          const lastSixMonthOrderspromise =  Order.find({
            createdAt:{
                $gte:SixMonthAgo,
                $lte:today,

            }
          });   
          
          const latestTransactionPromise = Order.find({})
          .select(["orderItems","discount" , "totel" , "status"])
          .limit(4)



          const [thisMonthProducts,thisMonthUsers,thisMonthOrders,lastMonthProducts,  lastMonthUsers,  lastMonthOrders, productsCount , usersCount  , allorders ,  lastSixMonthOrders,categories, FemaleUsersCount , latestTransaction]= await Promise.all([

            thisMonthProductspromise,
            thisMonthUserspromise,
            thisMonthOrderspromise,
            lastMonthProductspromise,
            lastMonthUserspromise,
            lastMonthOrderspromise,
            product.countDocuments(),
            user.countDocuments(),
            Order.find({}).select("totel"),
            lastSixMonthOrderspromise,
            product.distinct("category"),
            user.countDocuments({_gender:"female"}), 
            latestTransactionPromise,
          ])
  
          const thisMonthRevenu = thisMonthOrders.reduce((totel , order)=>totel+(order.totel||0),0);

          const lastMonthRevenu = lastMonthOrders.reduce((totel , order)=>totel+(order.totel||0),0);


          const changepercent={
            revenue:calculatePercentage(thisMonthRevenu,lastMonthRevenu),
            product: calculatePercentage(
                thisMonthProducts.length,
                lastMonthProducts.length) ,

            user :   calculatePercentage(
                thisMonthUsers.length,
                lastMonthUsers.length),

           order :   calculatePercentage(
            thisMonthOrders.length,
             lastMonthOrders.length)
    
          }

  const revenue =
   allorders.reduce((totel , order)=>totel+(order.totel||0),0);

  const count ={
    revenue,
    product:productsCount,
    user:usersCount,
    order:allorders.length,
  }

  const orderMonthCount= new Array (6).fill(0);
  const orderMonthRevenu= new Array (6).fill(0);



  lastSixMonthOrders.forEach((order)=>{
     const creationDate= order.createdAt;
     const monthDiffrent = (today.getMonth() - creationDate.getMonth() + 12)%12 ;

     if(monthDiffrent < 6){
        orderMonthCount[6-monthDiffrent-1]  += 1;
        orderMonthRevenu[6-monthDiffrent-1]  += order.totel;
     }
  })



  const categoryCount = await getInventories({
    categories,
    productsCount
  });


  const userRatio= {
    male: usersCount - FemaleUsersCount,
    female : FemaleUsersCount,
  }

const modifiedLatestTransaction= latestTransaction.map((i)=>({
    _id: i._id,
    discount:i.discount,
    amount:i.totel,
    quantity:i.orderItems.length,
    status:i.status
}))   


    stats ={
        categoryCount,
        changepercent,
        count,
        chart:{
            order:orderMonthCount,
            revanue:orderMonthRevenu,
        },
        userRatio,
        latestTransaction:modifiedLatestTransaction,
    }

    MyCache.set(key, JSON.stringify(stats))
      


    }
        return res.status(200).json({
            succes:true,
            stats,
        })
})



export const getPieChart = TryCatch(async(req , res ,next)=>{

    let charts ;
    const key ="admin-pie-chart";

    if(MyCache.has(key))
    charts = JSON.parse(MyCache.get(key))

    else{


        const allOrdersPromise = Order.find({}).select(["totel", "discount" , "subtotel" , "tax" , "shippingCharges"])

const [processOrder  , shippedOrder , deliveredOrder , categories ,productsCount , outOfStock , allOrders , allusers , AdminUsers , customerUsers]= await Promise.all([
    Order.countDocuments({status:"processing"}),
    Order.countDocuments({status:"shipped"}),
    Order.countDocuments({status:"delivered"}),
    product.distinct("category"),
    product.countDocuments(),
    product.countDocuments({stock:0}),
    allOrdersPromise,
    user.find({}).select(["_dob"]),
    user.countDocuments({role:"Admin"}),
    user.countDocuments({role:"user"}),
])

const OrderFullFillment = {
    processing:processOrder,
    shipped:shippedOrder,
    delivered:deliveredOrder,
};


const  ProductCategories= await getInventories({
    categories,  productsCount
  });


  const StockAvaliblity= {
    InStock : productsCount - outOfStock,
    outOfStock,
}
  
 const gorssIncome= allOrders.reduce((prev , order) =>prev+(order.totel || 0),);

  
    const discount= allOrders.reduce(
        (prev , order)=>prev+(order.discount || 0),);

      
        const productionCost= allOrders.reduce(
            (prev , order)=>prev+(order.shippingCharges || 0),)    

            const burnt= allOrders.reduce(
                (prev , order)=>prev+(order.tax || 0),)      


                const marketingCost= Math.round(gorssIncome.totel*(30 /100));

                const netMargin = gorssIncome - discount - productionCost - burnt - marketingCost;
                

         

 const revanueDistribution = {
    netMargin,
    discount,
    productionCost,
    burnt,
    marketingCost,
 }


 const userAgeGroup ={
  teen:allusers.filter((i)=>i.age<20).length,
  adult:allusers.filter((i)=>i.age>=20 && i.age>40 ).length,
  old:allusers.filter((i)=>i.age>=40).length,

 }

 const AdminCustomer = {
  admin:AdminUsers,
  customer:customerUsers
 }

charts ={ 
    OrderFullFillment,
    ProductCategories,
    StockAvaliblity,
    revanueDistribution,
    AdminCustomer,
    userAgeGroup 
};

MyCache.set(key, JSON.stringify(charts));

}

    return res.status(200).json({
        succes:true,
        charts,
    });
});



export const getBarChart = TryCatch(async(req , res , next)=>{

  const key ="admin-bar-chartas";
  let charts;

  if(MyCache.has(key))
  charts = JSON.parse(MyCache.get(key))

  else{

    const today = new Date();


    const SixMonthAgo = new Date();
    SixMonthAgo.setMonth(SixMonthAgo.getMonth()-6);

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth()-12);


    const SixMonthProductpromise =  product.find({
      createdAt:{
          $gte:SixMonthAgo,
          $lte:today,

      }
    }).select("createdAt")

    
    const SixMonthUserspromise =  user.find({
      createdAt:{
          $gte:SixMonthAgo,
          $lte:today,

      }
    }).select("createdAt")

    const twelveMonthOrderspromise =  Order.find({
      createdAt:{
          $gte:twelveMonthAgo,
          $lte:today,

      }
    }).select("createdAt")


    const [products , users , orders]=await Promise.all([ SixMonthProductpromise , SixMonthUserspromise, twelveMonthOrderspromise])


 const productsCount = getChartData({length:6, today , docarr:products})
 const usersCount = getChartData({length:6, today , docarr:users})
 const ordersCount = getChartData({length:12, today , docarr:orders})

    charts={
      users:usersCount,
      products:productsCount,
      orders:ordersCount
    }

    MyCache.set(key , JSON.stringify(charts));
  }


  return res.status(200).json({
    succes:true,
    charts,
});
});


export const getLineChart = TryCatch(async(req, res, next)=>{

  const key ="admin-line-chartas";
  let charts;

  if(MyCache.has(key))
  charts = JSON.parse(MyCache.get(key))

  else{

    const today = new Date();
    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth()-12);

    const basequery={createdAt:{
      $gte:twelveMonthAgo,
      $lte:today,

  }}
    const [products , users , orders]=await Promise.all([  
      product.find(basequery).select("createdAt") ,
      user.find( basequery).select("createdAt"),
      Order.find( basequery ).select(["createdAt" , "discount" , "totel"])
    ])
    
    const productsCount = getChartData({length:12, today , docarr:products})
 const usersCount = getChartData({length:12, today , docarr:users})
 const discount = getChartData({length:12, today , docarr:orders, property:"discount"})


 const revanue = getChartData({length:12, today , docarr:orders, property:"totel"})


    charts={
      users:usersCount,
      products:productsCount,
      discount,
      revanue,
    }

    MyCache.set(key , JSON.stringify(charts));
  }


  return res.status(200).json({
    succes:true,
    charts,
});
})