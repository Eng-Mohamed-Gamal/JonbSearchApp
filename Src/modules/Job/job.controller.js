import moment from "moment";
import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

/*==================================addJob============================================== */

export const addJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyName,
  } = req.body;
  const { _id } = req.authUser;
  // companyNameHr check
  const isCompanyExist = await Company.findOne({ companyName, companyHR: _id });
  if (!isCompanyExist)
    return next(
      new Error("Wrong Credentials Hr Not Authorized", { cause: 401 })
    );

  // create job
  const addedJop = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: _id,
    companyName,
  });

  if (!addedJop) return next(new Error("Create Fail", { cause: 500 }));
  return res.status(201).json({ message: "Done", addedJop });
};

/*==================================updateJob============================================== */

export const updateJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { _id } = req.authUser;
  const { jobId } = req.params;

  // create job
  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, addedBy: _id },
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );

  if (!updatedJob) return next(new Error("Update Fail", { cause: 500 }));
  return res.status(201).json({ message: "Done", updatedJob });
};

/*==================================deleteJob============================================== */

export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;
  const { _id } = req.authUser;
  // delete job
  const deletedJob = await Job.findOneAndDelete({ _id: jobId, addedBy: _id });
  if (!deletedJob) return next(new Error("Delete Fail", { cause: 500 }));

  // 2-delete the related applications
  const applications = await subCategoryModel.deleteMany({ jobId });
  if (applications.deletedCount <= 0) {
    console.log(applications.deletedCount);
    console.log("There is no related applications");
  }
  return res.status(201).json({ message: "Done", deletedJob });
};

/*==================================getAllJobsWithCompanys============================================== */

export const getAllJobsWithCompanys = async (req, res, next) => {
  const jobs = await Job.find().lean();
  if (!jobs.length) return next(new Error("There Is No Jobs", { cause: 404 }));
  for (const job of jobs) {
    const company = await Company.findOne({ companyName: job.companyName });
    job.company = company;
  }
  return res.status(200).json({ message: "Done", jobs });
};

/*==================================getAllJobsWithSpecificCompany============================================== */

export const getAllJobsWithSpecificCompany = async (req, res, next) => {
  const { companyName } = req.query;
  const Jobs = await Job.find({ companyName });
  if (!Jobs.length) return next(new Error("No Jobs Found", { cause: 404 }));
  return res.status(200).json({ message: "Done", companyName, Jobs });
};

/*==================================getAllJobsWithFilters============================================== */

export const getAllJobsWithFilters = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  const keys = {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  };

  // check undefined
  const checkUndefined = () => {
    const filter = Object.entries(keys).reduce((object, [key, value]) => {
      if (value != undefined) {
        object[key] = value;
      }
      return object;
    }, {});
    if (filter.technicalSkills) {
      filter.technicalSkills = { $all: filter.technicalSkills };
    }
    return filter;
  };
  // find jobs
  const Jobs = await Job.find(checkUndefined());
  if (!Jobs.length) return next(new Error("No Jobs Found", { cause: 404 }));
  return res.status(200).json({ message: "Done", Jobs });
};

/*==================================applyToJob============================================== */

export const applyToJob = async (req, res, next) => {
  const { userTechSkills, userSoftSkills } = req.query;
  const { _id } = req.authUser;
  const { jobId } = req.params;

  // jobId Check
  const isJobExist = await Job.findById(jobId);
  if (!isJobExist) return next(new Error("NO Job Found", { cause: 404 }));

  // if User Alredy apply
  const isUserAlreadyApply = await Application.findOne({ jobId, userId: _id });
  if (isUserAlreadyApply)
    return next(
      new Error("You Are Already Applied To This Job", { cause: 400 })
    );

  // upload to cloudinary
  const userResume = {};
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `Jobs/jobID-${jobId}/userId-${_id}`,
      unique_filename: true,
      use_filename: true,
    });
  userResume.secure_url = secure_url;
  userResume.public_id = public_id;

  // create application
  const application = await Application.create({
    userResume,
    userSoftSkills,
    userTechSkills,
    userId: _id,
    jobId,
    applyDate: moment().format("L"),
  });

  if (!application) {
    // delete from cloudinary
    await cloudinaryConnection().api.delete_resources_by_prefix(
      `Jobs/jobID-${jobId}/userId-${_id}`
    );
    await cloudinaryConnection().api.delete_folder(
      `Jobs/jobID-${jobId}/userId-${_id}`
    );
    return next(new Error("Create Fail", { cause: 500 }));
  }
  return res.status(201).json({ message: "Create Done", application });
};
