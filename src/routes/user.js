import  express from "express";
import  {newUser}  from "../controllers/user.controle.js";
import { getAllUsers , getuser  , deleteuser } from "../controllers/user.controle.js";
import { adminonly } from "../middleware/auth.js";


const app = express.Router();

// /api/v1/user/new

app.post("/new" , newUser);

///api/v1/user/all

app.get("/all" ,adminonly, getAllUsers);
 

app.route("/:id" ).get( getuser).delete(adminonly,deleteuser)

// app.put("/update",reqData)


export default app;