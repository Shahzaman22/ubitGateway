const jwt = require('jsonwebtoken')
module.exports = function (req,res,next){
    const token = req.headers.authorization
    if(!token) return res.status(404).send('Access denied . No token provided')

    try {
        const decoded = jwt.verify(token,process.env.PRIVATE_KEY)
        req.user = decoded;
        next()    
        } 
        catch (error) 
        {
            res.status(400).send('Invalid token')
        }
}