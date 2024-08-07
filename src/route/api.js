import express from "express";
import employeeController from "../controller/employee-controller.js";
import { upload } from "../middleware/upload-middleware.js";

const employeeRouter = new express.Router();

employeeRouter.post("/api/employee", upload.single('foto'), employeeController.create);

export {
    employeeRouter
}