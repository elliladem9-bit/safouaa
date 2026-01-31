import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cours"
  },
  percentage: Number
});

export default mongoose.model("Progress", progressSchema);