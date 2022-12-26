import express from "express";
const router = express.Router();

import bodyParser from "body-parser";
router.use(bodyParser.json());

import cors from "cors";
router.use(cors());

import * as middlewaresUsers from "./routes/user/middlewaresUser.js"
import * as user from "./routes/user/user.js"

import * as middlewaresTasks from "./routes/tasks/middlewaresTasks.js"
import * as task from "./routes/tasks/tasks.js"

router.get("/", (req, res) => res.status(200).json({Server: "Running"}));

router.get("/login", user.userLogin);
router.get("/users", user.getUsers);
router.post("/user", middlewaresUsers.verifyUserEmailPassword, middlewaresUsers.verifyHasUser, user.postUser);
router.delete("/user", middlewaresUsers.verifyToken, user.deleteUser);

router.get("/tasks",  middlewaresUsers.verifyToken, task.getTasksFromUser);
router.post("/task", middlewaresUsers.verifyToken, middlewaresUsers.verifyNotHasUser, 
                     middlewaresTasks.verifyTitleTask, task.postTask);
router.put("/task", middlewaresUsers.verifyToken, middlewaresTasks.verifyTitleTask, task.updateTask )
router.delete("/task", middlewaresUsers.verifyToken, task.deleteTask);


export default router;