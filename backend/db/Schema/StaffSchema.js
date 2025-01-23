import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  embedding: { type: [Number], required: true },
});



export default mongoose.model('staff', StaffSchema);
