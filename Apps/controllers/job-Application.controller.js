const {JobApplication} =  require('../model/job-Application')

// Submit a job application
exports.post = async (req,res ) => {
    try {
        const { userId, jobId, coverLetter } = req.body;
        const newJobApplication = new JobApplication({ userId, jobId, coverLetter });
        const savedJobApplication = await newJobApplication.save();
        res.status(201).json(savedJobApplication);
      } catch (error) {
        res.status(500).json({ error: "An error occurred while submitting the job application" });
      }
}