import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  
  const enrollUserInCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const { courseId } = req.params;
      const enrollment = await enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Error enrolling", error: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const { courseId } = req.params;
      await enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error unenrolling", error: error.message });
    }
  };

  app.post("/api/enrollments/:courseId", enrollUserInCourse);
  app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
}