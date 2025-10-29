import mongoose from 'mongoose';

const hackathonEnrollmentSchema = new mongoose.Schema({
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

hackathonEnrollmentSchema.index({ hackathon: 1, user: 1 }, { unique: true });

const HackathonEnrollment = mongoose.model('HackathonEnrollment', hackathonEnrollmentSchema);

export default HackathonEnrollment;


