import "dotenv/config";
import session from "express-session";
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz" 
mongoose.connect(CONNECTION_STRING);

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://kambaz-next-js-git-a5-aparnaa-rajans-projects.vercel.app",
      process.env.CLIENT_URL,
      /\.vercel\.app$/  
    ].filter(Boolean),
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
  }
};

if (process.env.SERVER_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    ...sessionOptions.cookie,
    sameSite: "none",
    secure: true,
    httpOnly: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port', process.env.PORT || 4000);
    console.log('SERVER_ENV:', process.env.SERVER_ENV);
    console.log('CLIENT_URL:', process.env.CLIENT_URL);
});