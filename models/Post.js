const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model User (nếu có)
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    jobRequirement: {
        type: [String],
        required: true
    },
    salary: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    expiredDate: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4], // 1: Chờ phê duyệt; 2: Không được phê duyệt; 3: Đang mở (được phê duyệt); 4: Đã đóng (do nhà tuyển dụng không tuyển nữa, đã hết hạn, có thể renew lại).

        default: 1,
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema, "Posts");