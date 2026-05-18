import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  clients: {
    type: [ClientSchema],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
