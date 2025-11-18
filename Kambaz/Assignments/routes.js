import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  
  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    assignmentsDao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
    res.json(status);
  };

  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}