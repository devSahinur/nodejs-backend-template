const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const paymentController = require("../../controllers/payment.controller");

const router = express.Router();


router
  .route("/")
  .post(auth("employee"), paymentController.processPayment)
//   .get(auth("client"), taskController.getTasks);

// router.route("/:taskId").get(auth("common"), taskController.getTask);

module.exports = router;
