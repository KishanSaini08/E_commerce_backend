
import express from "express";
import { adminonly } from "../middleware/auth.js";
import { getLatestProduct, newproduct , getAllCategroies, getAdminProducts 
    , getsingleproduct, updateproduct, deleteProduct, getAllProducts } from "../controllers/products.controler.js";
import { singleUpload  } from "../middleware/multer.js"; 

const app = express.Router();

app.post("/new", adminonly, singleUpload,newproduct);

app.get("/All" ,getAllProducts)

app.get("/latest" , getLatestProduct)

app.get("/categroies" , getAllCategroies)
app.get("/admin-products" ,adminonly ,getAdminProducts)


app.route("/:id").get(getsingleproduct).put(adminonly,singleUpload , updateproduct).delete(adminonly,deleteProduct)


export default app;
