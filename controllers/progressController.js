import Progress from "../models/progress.js";

export const updateProgress = async (req, res) => {
  const { courseId, percentage } = req.body;

  const progress = await Progress.findOneAndUpdate(
    { student: req.user.id, course: courseId },
    { percentage },
    { upsert: true, new: true }
  );

  res.json(progress);
};

export const getProgress = async (req, res) => {
  const progress = await Progress.find({ student: req.user.id })
    .populate("course", "title");

  res.json(progress);
};