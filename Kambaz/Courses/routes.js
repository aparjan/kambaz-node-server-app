import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  
  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error finding courses", error: error.message });
    }
  };

  const findCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await dao.findCourseById(courseId);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error finding course", error: error.message });
    }
  };

  const createCourse = async (req, res) => {
    try {
      const course = await dao.createCourse(req.body);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error creating course", error: error.message });
    }
  };

  const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const status = await dao.deleteCourse(courseId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error deleting course", error: error.message });
    }
  };

  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const courseUpdates = req.body;
      await dao.updateCourse(courseId, courseUpdates);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
  };

  const findModulesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("🔍 Finding modules for course:", courseId);
    const modules = await modulesDao.findModulesForCourse(courseId);
    console.log("✅ Modules found:", modules.length);
    console.log("✅ Module details:", modules);
    res.json(modules);
  } catch (error) {
    console.error("❌ Error finding modules:", error);
    res.status(500).json({ message: "Error finding modules", error: error.message });
  }
};

  const createModuleForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("📝 Creating module for course:", courseId);
    console.log("📝 Module data:", req.body);
    
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(courseId, module);
    console.log("✅ Module created:", newModule);
    res.json(newModule);
  } catch (error) {
    console.error("❌ Error creating module:", error);
    res.status(500).json({ message: "Error creating module", error: error.message });
  }
};

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Error finding assignments", error: error.message });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = {
        ...req.body,
        course: courseId,
      };
      const newAssignment = await assignmentsDao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      res.status(500).json({ message: "Error creating assignment", error: error.message });
    }
  };

    const findUsersForCourse = async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error finding users", error: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error enrolling", error: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error unenrolling", error: error.message });
    }
  };

  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.post("/api/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
}