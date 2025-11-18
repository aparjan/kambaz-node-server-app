import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  
  //console.log("Registering Module routes...");
  
  const deleteModule = (req, res) => {
    //console.log("DELETE module called with ID:", req.params.moduleId);
    const { moduleId } = req.params;
    modulesDao.deleteModule(moduleId);
    res.sendStatus(204);
  };

  const updateModule = (req, res) => {
    //console.log("UPDATE module called with ID:", req.params.moduleId);
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = modulesDao.updateModule(moduleId, moduleUpdates);
    res.json(status);
  };

  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
  
  //console.log("Module routes registered!");
}