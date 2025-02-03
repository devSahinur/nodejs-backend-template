const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require("../config/response");
const { aboutService } = require('../services');

const createAbout = catchAsync(async (req, res) => {
    const about = await aboutService.createAbout(req.body);
    res.status(httpStatus.CREATED).json(response({ message:"About Created", status: "OK", statusCode:httpStatus.CREATED , data: about}));
});

const getAbouts = catchAsync(async (req, res) => {
    const result = await aboutService.queryAbouts();
    res.status(httpStatus.OK).json(response({ message:"About", status: "OK", statusCode:httpStatus.OK , data: result}));
});

module.exports = {
    createAbout,
    getAbouts
};