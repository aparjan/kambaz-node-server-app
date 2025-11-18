import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseId);
}

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignmentIndex = assignments.findIndex((a) => a._id === assignmentId);
  if (assignmentIndex !== -1) {
    Database.assignments[assignmentIndex] = { 
      ...Database.assignments[assignmentIndex], 
      ...assignmentUpdates 
    };
    return Database.assignments[assignmentIndex];
  }
  return null;
}