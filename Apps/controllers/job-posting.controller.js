const { Job, schema } = require("../model/job-posting");

//JOB POSTING
exports.jobPost = async (req,res) => {
  try {
    const { error } = schema.validate(req.body)
  if (error) return res.status(404).send(error.details[0].message)

    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the job posting" });
  }
};
//GET ALL JOB POSTS
exports.getJobPosts = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the jobs" });
  }
};

//GET JOB POST BY ID
exports.getJobPost = async (req, res) => {
  try {
    const job = await Job.findById(req.query.id);
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the job" });
  }
};
