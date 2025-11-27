import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  
  const deleteModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const status = await modulesDao.deleteModule(courseId, moduleId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error deleting module", error: error.message });
    }
  };

  const updateModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const moduleUpdates = req.body;
      const status = await modulesDao.updateModule(courseId, moduleId, moduleUpdates);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error updating module", error: error.message });
    }
  };

  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}