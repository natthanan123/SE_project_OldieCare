const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  elderlyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Elderly' }, 
  title: { type: String, required: true },
  time: { type: String },
  status: { type: String, default: 'Pending' },
  type: { type: String }
});

module.exports = mongoose.model('Activity', activitySchema);