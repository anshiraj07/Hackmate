import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  organizer: { type: String, required: true, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon;


