const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI;
        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;