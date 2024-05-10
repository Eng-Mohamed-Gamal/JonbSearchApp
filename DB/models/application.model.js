import { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {type : Types.ObjectId , ref : "Job" , required : true},
    companyName : {type : Types.ObjectId , required : true , unique : true} ,
    userId: {type : Types.ObjectId , ref : "User" , required : true},
    userTechSkills: [],
    userSoftSkills: [],
    userResume: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
    },
    applyDate : {type : String , required : true}
  },
  { timestamps: true }
);

const Application = model("Application" , applicationSchema)

export default Application ;
