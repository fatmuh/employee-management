import express from "express";
import employeeController from "../controller/employee-controller.js";
import { upload } from "../middleware/upload-middleware.js";

const employeeRouter = new express.Router();

employeeRouter.get("/api/employees", employeeController.getAll);
employeeRouter.post("/api/employee", upload.single('foto'), employeeController.create);
employeeRouter.get('/api/employee/:nomor', employeeController.get);
employeeRouter.put('/api/employee/:nomor', upload.single('foto'), employeeController.update);
employeeRouter.delete('/api/employee/:nomor', employeeController.remove);

export {
    employeeRouter
}