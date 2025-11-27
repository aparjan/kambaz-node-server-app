import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  
  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      await assignmentsDao.deleteAssignment(assignmentId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting assignment", error: error.message });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const status = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error updating assignment", error: error.message });
    }
  };

  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}