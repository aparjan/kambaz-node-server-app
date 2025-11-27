import model from "./model.js";
import enrollmentsModel from "../Enrollments/model.js";

export const findAllCourses = () => 
  model.find({}, { name: 1, description: 1 });

export const findCourseById = (courseId) => model.findById(courseId);

export const findCoursesForEnrolledUser = async (userId) => {
  console.log("🔍 findCoursesForEnrolledUser called with userId:", userId);
  
  // Use Enrollments model to find enrolled courses
  const enrollments = await enrollmentsModel.find({ user: userId });
  console.log("📋 Enrollments found:", enrollments.length);
  
  const courseIds = enrollments.map((e) => e.course);
  console.log("🎓 Course IDs:", courseIds);
  
  // Get courses from MongoDB that match the enrolled course IDs
  // Only return name and description
  const courses = await model.find(
    { _id: { $in: courseIds } }, 
    { name: 1, description: 1, image: 1, number: 1 }
  );
  console.log("✅ Courses found in MongoDB:", courses.length);
  
  return courses;
};

export const createCourse = (course) => {
  console.log("➕ Creating course:", course);
  const newCourse = { ...course, _id: `${Date.now()}` };
  console.log("➕ New course with ID:", newCourse);
  return model.create(newCourse);
};

export const updateCourse = (courseId, courseUpdates) => {
  console.log("📝 Updating course:", courseId, "with:", courseUpdates);
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
};

export const deleteCourse = async (courseId) => {
  console.log("🗑️ Deleting course:", courseId);
  // Also delete all enrollments for this course
  await enrollmentsModel.deleteMany({ course: courseId });
  return model.deleteOne({ _id: courseId });
};