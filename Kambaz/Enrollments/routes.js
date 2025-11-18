import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  
  const enrollUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
    const enrollment = { user: currentUser._id, course: courseId };
    res.json(enrollment);
  };

  const unenrollUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(204);
  };

  app.post("/api/enrollments/:courseId", enrollUserInCourse);
  app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
}