const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userType: {
        type: Number,
        enum: [1, 2, 3], // 1: Admin, 2: JobSeeker, 3: Employer
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true // Jobseeker/Admin thì có thể không bắt buộc
    },
    avatar: {
        type: String
    },
    description: {
        type: String
    }
},
    { timestamps: true });

const jobSeekerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    experience: {
        type: [String],
    },
    academicLevel: {
        type: [String],
    },
    skills: {
        type: [String],
    }
});

const employerSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    }
});

const adminSchema = new Schema({

});

const User = mongoose.model('User', userSchema, "Users");
const JobSeeker = User.discriminator('JobSeeker', jobSeekerSchema);
const Employer = User.discriminator('Employer', employerSchema);
const Admin = User.discriminator('Admin', adminSchema);

module.exports = {
    User,
    JobSeeker,
    Employer,
    Admin
};
