const {JobApplication} =  require('../model/job-Application')

// Submit a job application
exports.post = async (req,res ) => {

    try {
      const newJobApplication = new JobApplication(req.body);
    
      if (req.file) {
        newJobApplication.resume = req.file.filename;
      }
    
      const savedJobApplication = await newJobApplication.save();
      res.status(201).json(savedJobApplication);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while submitting the job application" });
    }
    

};


// Count Users Applied for a Job
exports.getJobApplicationCount = async (req, res) => {
  try {
    const jobId = req.query.jobId;

    const appliedUsersCount = await JobApplication.countDocuments({ jobId: jobId });

    res.json({ appliedUsersCount });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the applied users count' });
  }
};






