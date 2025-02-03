const express = require('express');
const validate = require('../../middlewares/validate');
const aboutController = require('../../controllers/about.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();


router
    .route('/')
    .post(auth('admin'), aboutController.createAbout)
    .get( aboutController.getAbouts)



module.exports = router;