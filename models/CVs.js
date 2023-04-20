const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const curriculumVitaeSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    description: {
        type: String,
    },
    CVFileURL: {
        type: String,
        required: true,
    },
    status: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 2,
    },
  }, { timestamps: true });
  
  const CV = mongoose.model('CV', curriculumVitaeSchema, 'CurriculumVitaes');
  
  module.exports = {CV};