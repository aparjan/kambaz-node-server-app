import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import Database from "../Database/index.js";

export default function UserRoutes(app) {
  
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const findEnrollmentsForUser = (req, res) => {
    try {
      //console.log("findEnrollmentsForUser called");
      //console.log("req.params:", req.params);
      
      let { userId } = req.params;
      //console.log("userId from params:", userId);
      
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        //console.log("currentUser from session:", currentUser);
        
        if (!currentUser) {
          //console.log("No current user in session");
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      
      //console.log("Database:", Database);
      const { enrollments } = Database;
      //console.log("All enrollments:", enrollments);
      
      const userEnrollments = enrollments.filter((e) => e.user === userId);
      //console.log("Filtered enrollments for user", userId, ":", userEnrollments);
      
      res.json(userEnrollments);
    } catch (error) {
      //console.error("Error in findEnrollmentsForUser:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const user = dao.findUserById(req.params.userId);
    res.json(user);
  };

  const deleteUser = (req, res) => {
    const status = dao.deleteUser(req.params.userId);
    res.json(status);
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/profile", profile);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);
}