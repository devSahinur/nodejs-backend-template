const express = require('express');
const validate = require('../../middlewares/validate');
const privacyController = require('../../controllers/privacy.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();


router
    .route('/')
    .post(auth('admin'), privacyController.createPrivacy)
    .get( privacyController.getPrivacy)


module.exports = router;