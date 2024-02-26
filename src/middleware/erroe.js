export const errorMiddleWare =(err , req , res , next)=>{


    err.massage = err.message || "Internal server error";
    err.statusCode = err.status || 500

    console.log(err)
    if(err.name === "CastError") err.massage="INVLID ID";

    res.status(err.statusCode).json({
        success:false,
        message:err.massage,
    })
}

export const TryCatch = (e)=>(req,res, next)=>{
    return Promise.resolve(e(req,res,next)).catch(next)
}