const express = require('express')
const dotenv = require('dotenv');
const cors = require("cors");

const connectToDatabase = require('./config/database');
const app = express()
const route = require('./routes')
// Setup
dotenv.config();
const PORT = process.env.SERVER_PORT || 2345;


// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app)


// Connect to database
connectToDatabase()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server started onn port ${PORT}`)
        );
    });