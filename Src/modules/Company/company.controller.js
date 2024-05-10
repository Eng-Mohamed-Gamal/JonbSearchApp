import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";

import fs from "fs";

/*==================================addCompany============================================== */

export const addCompany = async (req, res, next) => {
  const {
    companyName,
    descreption,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  const { _id } = req.authUser;
  // companyName check
  const isCompanyNameExist = await Company.findOne({ companyName });
  if (isCompanyNameExist)
    return next(new Error("CompanyName Is Already Exist", { cause: 400 }));

  // companyEmail check
  const isCompanyEmailExist = await Company.findOne({ companyEmail });
  if (isCompanyEmailExist)
    return next(new Error("companyEmail Is Already Exist", { cause: 400 }));

  // add company
  const addedCompany = await Company.create({
    companyName,
    descreption,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: _id,
  });

  if (!addedCompany) return next(new Error("Create Fail", { cause: 500 }));
  return res.status(201).json({ message: "Done", addedCompany });
};

/*==================================updateCompany============================================== */

export const updateCompany = async (req, res, next) => {
  const {
    oldCompanyName,
    newCompanyName,
    descreption,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const { _id } = req.authUser;

  // companyName check
  const isCompanyNameExist = await Company.findOne({
    companyName: newCompanyName,
  });
  if (isCompanyNameExist)
    return next(new Error("CompanyName Is Already Exist", { cause: 400 }));

  // companyEmail check
  const isCompanyEmailExist = await Company.findOne({ companyEmail });
  if (isCompanyEmailExist)
    return next(new Error("companyEmail Is Already Exist", { cause: 400 }));
  //  update company
  const updatedCompany = await Company.findOneAndUpdate(
    { companyName: oldCompanyName, companyHR: _id },
    {
      companyName: newCompanyName,
      descreption,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { new: true }
  );
  if (!updatedCompany) return next(new Error("Update Fail", { cause: 500 }));

  // update all jobs with this companyName
  const jobs = await Job.updateMany(
    { companyName: oldCompanyName },
    { $set: { companyName: newCompanyName } }
  );
  // if the updateMany fail
  if (!jobs.modifiedCount) {
    await Company.findOneAndUpdate(
      { companyName: newCompanyName, companyHR: _id },
      {
        companyName: oldCompanyName,
      },
      { new: true }
    );
    return next(new Error("Erorr With Update CompanyName In Jobs"));
  }

  return res.status(200).json({ message: "Done", updatedCompany });
};

/*==================================deleteCompany============================================== */

export const deleteCompany = async (req, res, next) => {
  const { companyName } = req.body;
  const { _id } = req.authUser;
  // delete company
  const deletedCompany = await Company.findOneAndDelete({
    companyName,
    companyHR: _id,
  });
  // 2-delete the related jobs
  const jobs = await Job.deleteMany({ companyName });
  if (jobs.deletedCount <= 0) {
    console.log(jobs.deletedCount);
    console.log("There is no related jobs");
  }
  // 3-delete the related applications
  const applications = await Application.deleteMany({ categoryId });
  if (applications.deletedCount <= 0) {
    console.log(applications.deletedCount);
    console.log("There is no related applications");
  }
  if (!deletedCompany) return next(new Error("Delete Fail", { cause: 500 }));
  return res.status(200).json({ message: "Done", deletedCompany });
};

/*==================================searchCompanyWithName============================================== */

export const searchCompanyWithName = async (req, res, next) => {
  const { companyName } = req.body;
  // search company
  const company = await Company.findOne({ companyName });
  if (!company)
    return next(
      new Error("there Is No Company With This Name ", { cause: 404 })
    );
  return res.status(200).json({ message: "Done", company });
};

/*==================================getCompanyData============================================== */

export const getCompanyData = async (req, res, next) => {
  const { companyId } = req.params;
  // search company
  const company = await Company.findById(companyId);
  if (!company) return next(new Error("There Is No Company", { cause: 404 }));
  // search Jobs
  const jobs = await Job.find({ companyName: company.companyName });
  return res.status(200).json({
    message: "Done",
    company,
    jobs: jobs.length ? jobs : "There Is No Jobs For This Company",
  });
};

/*==================================getAllApplicationsForSpecificJobs============================================== */

export const getAllApplicationsForSpecificJobs = async (req, res, next) => {
  const { _id } = req.authUser;
  const { companyName } = req.body;
  // find jobs
  const jobs = await Job.find({ addedBy: _id, companyName }).lean();
  if (!jobs.length) return next(new Error("Wrong Credentials", { cause: 400 }));
  // find applications for each job
  for (const job of jobs) {
    const apllications = await Application.find({ jobId: job._id }).populate(
      "userId"
    );
    if (apllications.length) {
      job.applications = apllications;
    } else {
      job.apllications = "There Is No Apllications For This job";
    }
  }
  return res.status(200).json({ message: "Done", jobs });
};

export const getAllApplicationsAndCreateExcelSheet = async (req, res, next) => {
  const { companyName, applyDate } = req.query;
  // company Check
  const isCompanyExist = await Company.findOne({ companyName });
  if (!isCompanyExist) return next(new Error("Wrong Credentials"));
  // find jobs
  const jobs = await Job.find({ companyName });
  if (!jobs.length) return next(new Error("There Is No Jobs For This Company"));
  // loop on jobs
  let applications = [];
  let arr = [];
  let keys;
  let arr2 = [];
  for (const job of jobs) {
    // find Applications
    const applications = await Application.find({
      jobId: job._id,
      applyDate,
    })
      .select("-createdAt -updatedAt -__v -userResume")
      .lean();
    keys = Object.keys(
      await Application.findOne({ jobId: job._id, applyDate })
        .select("-createdAt -updatedAt -__v -userResume")
        .lean()
    );
    arr.push(...applications);
  }
  if (!arr.length)
    return next(new Error("There Is No Applications For This Company Jobs"));

  for (let obj of arr) {
    arr2.push(Object.values(obj));
  }
  applications.push(keys);
  applications.push(...arr2);
  let handle = applications.map((ele) =>
    ele.map((e) => e.toString().replaceAll(",", "-"))
  );
  const csvContent = handle.map((arr) => arr.join(",")).join("\n");
  const path = "output.csv";
  fs.writeFileSync(path, csvContent, "utf-8");
  return res.status(200).json({ message: "Done" });
};
