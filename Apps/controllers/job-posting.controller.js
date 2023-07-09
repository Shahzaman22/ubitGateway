const { Job, schema } = require("../model/job-posting");

//JOB POSTING
exports.jobPost = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const newJob = new Job(req.body);

    let img;
    if (req.file) {
      img = req.file.path;
      newJob.img = img;
    }

    try {
      const savedJob = await newJob.save();
      const imageUrl = req.protocol + '://' + req.get('host') + '/' + img;
      savedJob.img = imageUrl;
      res.status(201).json(savedJob);
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};
//GET ALL JOB POSTS
exports.getJobPosts = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt : -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
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
      .json({ error: error.message });
  }
};

//Delete JOB POSTS BY ID
exports.deleteJobPosts = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Job post ID is required" });
    }

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ error: "Job post not found" });
    }

    res.status(200).json({ job, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get filtered Jobs
exports.getFilteredJobs = async (req, res) => {
  try {
    const jobType = req.query.jobType; 
    const jobs = await Job.find({ jobType: jobType }).sort({ postedAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

