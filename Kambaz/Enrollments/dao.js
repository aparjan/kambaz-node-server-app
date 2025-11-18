import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments = [...Database.enrollments, newEnrollment];
  return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (e) => !(e.user === userId && e.course === courseId)
  );
}