const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require("../config/response");
const { privacyService } = require('../services');

const createPrivacy = catchAsync(async (req, res) => {
    const privacy = await privacyService.createPrivacy(req.body);
    // console.log(privacy)
    res.status(httpStatus.CREATED).json(response({ message:"Privacy Created", status: "OK", statusCode:httpStatus.CREATED , data: privacy}));
});

const getPrivacy = catchAsync(async (req, res) => {
    const result = await privacyService.queryPrivacy();
    res.status(httpStatus.OK).json(response({ message:"Privacy", status: "OK", statusCode:httpStatus.OK , data: result}));
});

module.exports = {
    createPrivacy,
    getPrivacy
};