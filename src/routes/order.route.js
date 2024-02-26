import  express, { Router } from "express";
import { adminonly } from "../middleware/auth.js";
import { AllOrders, DeleteOrder, ProcessingOrder, getsingleOrders, myOrders, neworder } from "../controllers/order.controller.js";


const app = express.Router();

// /api/v1/order/new

app.post("/new" , neworder);

app.get("/my" , myOrders);

app.get("/All" , adminonly,AllOrders);

app.route("/:id").get(getsingleOrders).put(adminonly,ProcessingOrder).delete(adminonly ,DeleteOrder)



export default app;