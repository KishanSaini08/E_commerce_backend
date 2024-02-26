
import { TryCatch } from "../middleware/erroe.js";
import { product } from "../models/product.model.js"
import ErrorHandler from "../utils/utility_class.js";
import {rm }from "fs";
import { MyCache } from "../app.js";
import { Invlidatecache } from "../utils/feature.js";




export  const getLatestProduct = TryCatch
 (async(req,res,  next)=>{

    let products;

    if(MyCache.has("latest-products"))
    products= JSON.parse(MyCache.get("latest-products"));

    else {
        products = await  product.find().sort({createdAt:-1}).limit(5)
    MyCache.set("latest-products" , JSON.stringify(products))
}
        return res.status (200).json({
            success:true,
            products,
        })
    
    
    })

    export  const getAllCategroies = TryCatch
 (async(req,res,  next)=>{

    let categroies ; 
    if(MyCache.has("categroies"))
    categroies= JSON.parse(MyCache.get(categroies));

else{
    categroies = await    product.distinct("category") 
    MyCache.set("categroies" , JSON.stringify(categroies))
     
}
        return res.status (200).json({
            success:true,
            categroies,
        })

    })


    export  const getAdminProducts = TryCatch
 (async(req,res,  next)=>{

    let products;
    if(MyCache.has("all-products"))
    products= JSON.parse(MyCache.get("all-products"));

    else{
        products = await  product.find({})
    MyCache.set("categroies" , JSON.stringify(products))


    }

        return res.status (200).json({
            success:true,
            products,
        })
    
    
    })

    export const getsingleproduct = TryCatch(async (req, res, next) => {
        let Product; 
        const id = req.params.id;
    
        if (MyCache.has(`product-${id}`)) {
            Product = JSON.parse(MyCache.get(`product-${id}`));
        } else {
            Product = await product.findById(id); 
            if (!Product)
                return next(new ErrorHandler("Product NOT Found", 404));
    
            MyCache.set(`product-${id}`, JSON.stringify(Product));
        }
    
        return res.status(200).json({
            success: true,
            product: Product, 
        });
    });


    export  const newproduct = TryCatch (async(req,res,  next)=>{

        const { name , category , stock , price } = req.body;
            const photo = req.file;
        
            if(!photo) return next(new ErrorHandler("please add photo"));
            if( !name || !category || !stock || !price ){
                
                rm(photo.path, () => {
                    console.log("delete");
                })
        
            return next(new ErrorHandler("please add all fileds"));
        }
            await product.create({
                name ,
                stock, 
                price,
                category : category.toLowerCase(), 
                 photo: photo.path,
            })

       Invlidatecache({product:true , admin:true});
        
            return res.status (201).json({
                success:true,
                massage:"product created succesfully",
            })
        
        
        })
        
    

    export const updateproduct = TryCatch(async (req, res, next) => {
        const { id } = req.params;
        const { name, category, stock, price } = req.body;

        const photo = req.file;
    
        const Product = await product.findById(id);
        if (!Product)
            return next(new ErrorHandler("Product NOT Found", 404));
    
        if (photo) {
            rm(Product.photo, () => {
                console.log("Old photo deleted");
            });
            Product.photo = photo.path;
        }
    
        if (name) Product.name = name;
        if (price) Product.price = price;
        if (stock) Product.stock = stock;
        if (category) Product.category = category.toLowerCase();
    
        await Product.save();

   Invlidatecache({product:true , productId:product._id , admin:true});

    
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    });
    
    export const deleteProduct = TryCatch(async (req, res, next) => {
        const Product = await product.findById(req.params.id);
        if (!Product)
            return next(new ErrorHandler("Product NOT Found", 404));
    
        rm(Product.photo, () => {
            console.log("Old photo deleted");
        });
        await Product.deleteOne();

   Invlidatecache({product:true , productId:product._id ,admin:true});


    
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    });


    
export  const getAllProducts= TryCatch
(async(req,res,  next)=>{
    const{sreach , price , category , sort} = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1)*limit

const basequery ={}

if(sreach)
basequery.name={
    $regex:sreach,
    $options:"i"
}
if(price)
basequery.price={
    $lte:Number(price),
}

if(category)
basequery.category= category;

const productPromise = await product.find(basequery)
.sort( sort && {price:sort ==="asc" ? 1: -1})
.limit(limit)
.skip(skip) ;

const [products , filteredOnlyProducts ]= await Promise.all([
    productPromise,
      product.find(basequery)
])




   const Totalpage = Math.ceil( filteredOnlyProducts.length/limit)

       return res.status (200).json({
           success:true,
           products,
           Totalpage,
       })
   
   
   })