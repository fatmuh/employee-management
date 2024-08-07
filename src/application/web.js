import express from "express";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {employeeRouter} from "../route/api.js";

export const web = express()

web.use(express.json());
web.use(employeeRouter);

web.use(errorMiddleware);