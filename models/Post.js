const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    jobRequirement: {
        type: [String],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    expiredDate: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1,
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema, "Posts");