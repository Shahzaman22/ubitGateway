const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB is connected'))
.catch(() => console.log('DB Not connected'))