const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require("../config/response");
const { termsService } = require('../services');

const createTerms = catchAsync(async (req, res) => {
    const terms = await termsService.createTerms(req.body);
    res.status(httpStatus.CREATED).json(response({ message:"Terms Created", status: "OK", statusCode:httpStatus.CREATED , data: terms}));
});

const getTerms = catchAsync(async (req, res) => {
    const result = await termsService.queryTerms();
    res.status(httpStatus.OK).json(response({ message:"Terms", status: "OK", statusCode:httpStatus.OK , data: result}));
});

module.exports = {
    createTerms,
    getTerms
};