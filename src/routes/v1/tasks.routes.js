const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const taskController = require("../../controllers/tasks.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_SUBMIT_TASK = "./public/uploads/submitTask";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_SUBMIT_TASK);
const router = express.Router();

router.route("/service").get(auth("client"), taskController.homeServiceList);
router.route("/admin").get(auth("admin"), taskController.getAdminTasks);
router.route("/home").get(auth("employee"), taskController.taskHome);
router.route("/register/admin").get( taskController.getSubmittedTasks);
router.route("/register/single").get( taskController.getRegisterSingleTask);
router
  .route("/register")
  .post(auth("employee"), taskController.taskRegister)
  .get(auth("employee"), taskController.getEmployeeTasks)
  .patch(
    auth("employee"),
    [uploadUsers.array("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_SUBMIT_TASK),
    taskController.taskSubmit
  )
  .put( taskController.submitTaskUpdate);

router
  .route("/")
  .post(auth("client"), taskController.createTask)
  .get(auth("client"), taskController.getTasks);

router.route("/:taskId").get(auth("common"), taskController.getTask);

module.exports = router;
