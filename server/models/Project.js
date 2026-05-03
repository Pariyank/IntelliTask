const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline: { type: Date },
  actualCompletionDate: { type: Date }, 
  status: { 
    type: String, 
    enum: ['Planning', 'Active', 'Under Review', 'Completed'], 
    default: 'Planning' 
  },
  submissionNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);