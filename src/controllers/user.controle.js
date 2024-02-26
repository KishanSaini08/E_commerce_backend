
import { TryCatch } from "../middleware/erroe.js";
import   {user as UserModel}  from "../models/user.model.js";
import ErrorHandler from "../utils/utility_class.js";
// import getAllUsers from "../controllers/user.js"


export  const newUser = TryCatch(async (
  req   , res , next)=>{
      

    // throw(Error)
    
   const {_name , _email , _photo , _gender , _id , _dob} = req.body;


   
let newUser = await UserModel.findById(_id);
if (newUser) {
    return res.status(200).json({
        success: true,
        message: `welcome, ${newUser._name}`,
    });
}

if(!_id || !_name || !_email || !_dob || !_gender || !_photo)
return newUser(new ErrorHandler("please enter all fildes " , 400));

  newUser = await UserModel.create({
      _name ,
      _email ,
      _photo ,
      _gender ,
      _id ,
      _dob:new Date(_dob),
    });

    res.status(201).json({
      success : true  ,
      massage: `welcome , ${newUser._name}`
    });
  }
)


export const getAllUsers = TryCatch(async(req, res, next )=>{
   const newUser = await UserModel.find({})
    return res.status(200).json({
      success : true,
      newUser,
    })
  }) 


  export const getuser = TryCatch(async(req, res, next )=>{
   const  _id = req.params.id;

    const newUser = await UserModel.findById(_id)
  
    if (!newUser) return next(new ErrorHandler("Invlid id" , 400))

     return res.status(200).json({
       success : true,
       newUser,
     })
   }) 
 

   export const deleteuser = TryCatch(async(req, res, next )=>{
    const  _id = req.params.id;
 
     const newUser = await UserModel.findById(_id)
   
     if (!newUser) return next(new ErrorHandler("Invlid id" , 400))


     await newUser.deleteOne();
 
      return res.status(200).json({
        success : true,
        massage: "user delete successfully"
      })
    }) 
  

    // export const reqData = TryCatch(async(req,res,next)=>{
    //   console.log(req.body);

    //   res.json({
    //     message:"done"
    //   })
    // })
