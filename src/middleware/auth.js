import   {user as UserModel, }  from "../models/user.model.js";
import ErrorHandler from "../utils/utility_class.js";
import { TryCatch } from "./erroe.js";

export  const adminonly = TryCatch(async(req,res, next)=>{
     const {_id} = req.query;

     const newUser = await UserModel.findById(_id);
     if(!newUser)

      return next(new ErrorHandler("first login please" , 401));



     if(!newUser) 
     return next(new ErrorHandler("fack id" , 401));


     if(!newUser._role === "admin") 
     return next(new ErrorHandler("out of range" , 401));

     next();

})