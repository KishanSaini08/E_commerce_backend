import  express from "express";
import { adminonly } from "../middleware/auth.js";
import { getDashBoardState ,getPieChart , getBarChart ,getLineChart} from "../controllers/state.controler.js";

const app = express.Router();

// /api/v1/dashboard/stats

app.get("/stats", adminonly ,getDashBoardState );

app.get("/pie" , adminonly ,getPieChart);

app.get("/bar"  , adminonly,getBarChart);

app.get("/line" , adminonly, getLineChart );




export default app;