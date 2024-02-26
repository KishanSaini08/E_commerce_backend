import mongoose from "mongoose";
import validator from "validator";
const Schema = new mongoose.Schema(
    {
        _id:{
            type: String,
            required: [true ," Please enter ID"],
        },
        _name:{
            type: String,
            required: [true ," Please Enter Name"],
        },
        _email:{
            type: String,
            unique: [true  , "Email already exist"],
            required: [true ," Please Enter Name"],
            validate: validator.default.isEmail,
        },
        _photo:{
            type: String,
            required: [true ," Please add Photo"],
        },
        _role:{
            type: String,
            enum: ["admin" , "user"],
            default: "user",
        },
        _gender:{
            type: String,
            enum: ["male" , "female"],
            required: [true , "Please enter your gender"]
        },
        _dob:{
            type: Date,
            required: [true , "Please enter your Date of birth"]
        }
    },
    {
        timestamps: true,
    }
);

Schema.virtual("age").get(function(){
    const today = new Date();
    const dob = this._dob;

    let age = today.getFullYear() - dob.getFullYear();

    if(today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) 
    {
        age--;
    }

    return age;
});

 export const user = mongoose.model("user", Schema);



