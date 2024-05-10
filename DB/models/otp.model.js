import {  Schema, model } from "mongoose";


const otpSchema = new Schema({
    email : {type: String , required : true , unique : true } ,
    otp : {type : String , required : true} 
},{timestamps : true})

const Otp = model("Otp" , otpSchema)

export default Otp ;
 