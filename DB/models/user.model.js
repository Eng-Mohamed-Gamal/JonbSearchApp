import { Schema, model } from "mongoose";
import { systemRoles } from "../../Src/utils/systemRules.js";


const userSchema = new Schema({

    firstName : {type : String , required : true},
    lastName : {type : String , required : true} ,
    userName : {type : String , required : true} ,
    email : {type : String , required : true , unique : true , trim : true} ,
    password : {type : String , required : true} ,
    recoveryEmail : {type : String , required : true} ,
    DOB : {type : String , required : true} ,
    mobileNumber : {type : String , required : true , unique : true } ,
    role : {type : String , enum : [systemRoles.User , systemRoles.Company_HR] , default : systemRoles.User} ,
    status : {type : String , enum : ["online" , "offline"] , default : "offline"} ,
    hint : {type : String , required : true } 

},{timestamps : true})

const User = model("User" , userSchema)

export default User ;
