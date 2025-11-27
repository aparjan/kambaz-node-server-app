import model from "./model.js";

export const findCoursesForUser = async (userId) => {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
};

export const findUsersForCourse = async (courseId) => {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
};

export const enrollUserInCourse = (userId, courseId) => {
  return model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`,
  });
};

export const unenrollUserFromCourse = (userId, courseId) => {
  return model.deleteOne({ user: userId, course: courseId });
};

export const unenrollAllUsersFromCourse = (courseId) => {
  return model.deleteMany({ course: courseId });
};

export const findEnrollmentsForUser = (userId) => {
  return model.find({ user: userId });
};