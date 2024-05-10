import { Schema, Types, model } from "mongoose";


const companySchema = new Schema({
companyName : {type : String , required : true , unique : true} ,
descreption : {type : String , required : true} ,
industry  : {type : String  , required : true} ,
address : {type : String , required : true} ,
numberOfEmployees : {
    minNumber : {type : Number , required : true} ,
    maxNumber : {type : Number , required : true} ,
}   ,
companyEmail : {type : String , required : true , trim : true , unique : true}  ,
companyHR : {type : Types.ObjectId , required : true , ref : "User"}
}, {timestamps : true})


const Company = model("Company" , companySchema)

export default Company ;