const express = require('express');
const validate = require('../../middlewares/validate');
const termsController = require('../../controllers/terms.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();


router
    .route('/')
    .post(auth('admin'), termsController.createTerms)
    .get(termsController.getTerms)

module.exports = router;