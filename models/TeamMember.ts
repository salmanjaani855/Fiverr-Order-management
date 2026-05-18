import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  project: { type: String, required: true },
  clientName: { type: String, required: true },
  backgroundLyrics: { type: String, default: '' },
  assignedMembers: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
