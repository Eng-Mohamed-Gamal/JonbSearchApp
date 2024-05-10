import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      required: true,
      enum: ["onsite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["part-time", "full-time"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [], required: true },
    softSkills: { type: [], required: true },
    addedBy: { type: Types.ObjectId, required: true , ref : "User" },
    companyName : {type : String , required : true }
  },
  { timestamps: true }
);

const Job = model("Job", jobSchema);

export default Job;
