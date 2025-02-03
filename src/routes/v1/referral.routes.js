const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const referralController = require("../../controllers/referral.controller");

const router = express.Router();


router.route("/my").get(auth("common"), referralController.myReferrals);
router.route("/").post(auth("common"), referralController.claimed);

// router
//   .route("/:userId")
//   .get(auth("common"), validate(userValidation.getUser), userController.getUser)
//   .patch(
//     auth("common"),
//     [uploadUsers.single("image")],
//     convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
//     userController.updateUser
//   );

module.exports = router;
