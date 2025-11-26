import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {

  const createUser = async (req, res) => {
  try {
    const user = await dao.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
  
  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      const currentUser = await dao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      if (currentUser) {
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
      } else {
        res.status(401).json({ message: "Unable to login. Try again later." });
      }
    } catch (error) {
      res.status(500).json({ message: "Error signing in", error: error.message });
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

  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      const courses = await courseDao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error finding courses", error: error.message });
    }
  };

  const findEnrollmentsForUser = async (req, res) => {
    try {
      let { userId } = req.params;
      
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      
      const userEnrollments = await enrollmentsDao.findEnrollmentsForUser(userId);
      res.json(userEnrollments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      const newCourse = await courseDao.createCourse(req.body);
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.json(newCourse);
    } catch (error) {
      res.status(500).json({ message: "Error creating course", error: error.message });
    }
  };

  const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userUpdates = req.body;
    const currentUser = await dao.updateUser(userId, userUpdates);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

  const findAllUsers = async (req, res) => {
  try {
    const { role, name } = req.query;
    
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    
    const users = await dao.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error finding users", error: error.message });
  }
};

  const findUserById = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error finding user", error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };

  app.post("/api/users", createUser);
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