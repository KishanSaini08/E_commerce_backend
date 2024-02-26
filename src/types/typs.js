
const IUser = {
    _id: String,
    name: String,
    email: String,
    photo: String,
    // role: {
    //     type: String,
    //     enum: ["admin", "user"],
    // },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    dob: Date,
    createdAt: Date,
    updatedAt: Date,
    age: Number,
};


const newproductRequest = {
    name: String,
    category: String,
    price:Number,
    stock:Number,
}

// export type sreachRequestBody ={
//     sreach?:String
//     price?:String
//     category?:String
//     sort?:String
//     page?:String
// }


exports = IUser;


// export interface Basequery(
//     name:{
//         $regex:String,
//         $options:string
//     }
// )

