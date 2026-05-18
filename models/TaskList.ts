import mongoose from 'mongoose';

const TaskItemSchema = new mongoose.Schema({
  text: { type: String, default: '' },
  completed: { type: Boolean, default: false },
});

const TaskListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  items: {
    type: [TaskItemSchema],
    default: () =>
      Array.from({ length: 6 }, () => ({ text: '', completed: false })),
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TaskList || mongoose.model('TaskList', TaskListSchema);
