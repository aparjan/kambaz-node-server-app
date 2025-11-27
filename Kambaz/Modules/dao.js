import model from "./model.js";
import courseModel from "../Courses/model.js";

export const findModulesForCourse = async (courseId) => {
  console.log("🔍 DAO: Finding modules for course:", courseId);
  // Query modules collection by course field
  const modules = await model.find({ course: courseId });
  console.log("✅ DAO: Modules found:", modules.length);
  return modules;
};

export const createModule = async (courseId, module) => {
  console.log("➕ DAO: Creating module for course:", courseId);
  const newModule = { 
    ...module, 
    _id: `${Date.now()}`, 
    course: courseId 
  };
  const createdModule = await model.create(newModule);
  console.log("✅ DAO: Module created:", createdModule);
  return createdModule;
};

export const deleteModule = async (courseId, moduleId) => {
  console.log("🗑️ DAO: Deleting module:", moduleId);
  const status = await model.deleteOne({ _id: moduleId });
  console.log("✅ DAO: Module deleted");
  return status;
};

export const updateModule = async (courseId, moduleId, moduleUpdates) => {
  console.log("📝 DAO: Updating module:", moduleId);
  const updatedModule = await model.findByIdAndUpdate(
    moduleId,
    { $set: moduleUpdates },
    { new: true }
  );
  console.log("✅ DAO: Module updated:", updatedModule);
  return updatedModule;
};