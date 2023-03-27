const express = require('express')
const dotenv = require('dotenv');
const cors = require("cors");

const connectToDatabase = require('./config/database');
const posts = require('./routes/postsRoute')

const app = express()

// Setup
dotenv.config();
const PORT = process.env.SERVER_PORT || 2345;
// const notFound = require('./middlewares/not-found')
// const errorHandlerMiddleware = require('./middlewares/error-handler')

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("./public"))
app.use(express.json());

// routes
app.use('/api/v1/posts', posts)
// app.use(notFound)
// app.use(errorHandlerMiddleware)


// Connect to database
connectToDatabase()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server started onn port ${PORT}`)
        );
    });