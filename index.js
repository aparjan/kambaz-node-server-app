import "dotenv/config";
import session from "express-session";
import express from 'express';
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

const app = express();

// MUST be before session middleware
app.set('trust proxy', 1);

// CORS configuration
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://kambaz-next-js-git-a5-aparnaa-rajans-projects.vercel.app",
      process.env.CLIENT_URL,
      /\.vercel\.app$/  // Changed: Added the dot before vercel
    ].filter(Boolean),
  })
);

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Use SERVER_ENV instead of NODE_ENV
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