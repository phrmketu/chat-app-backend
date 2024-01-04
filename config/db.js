const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Database Connected!'.cyan.underline));
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit()
    }
}

module.exports = connectDB