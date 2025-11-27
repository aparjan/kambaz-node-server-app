import model from "./model.js";

export const findAssignmentsForCourse = (courseId) => {
  return model.find({ course: courseId });
};

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: `${Date.now()}` };
  return model.create(newAssignment);
};

export const deleteAssignment = (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: assignmentUpdates },
    { new: true }
  );
};