const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { withdrawalService } = require("../services");

const createWithdrawal = catchAsync(async (req, res) => {
    const withdrawal = await withdrawalService.createWithdrawal(req.user.id,req.body);
    res.status(httpStatus.CREATED).json(response({ message:"Withdrawal Request Created", status: "OK", statusCode:httpStatus.CREATED , data: withdrawal}));
});

const getWithdrawals = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["name", "status", "gender"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await withdrawalService.queryWithdrawals(req.query.type, filter, options);
    res.status(httpStatus.OK).json(response({ message:"Withdrawal", status: "OK", statusCode:httpStatus.OK , data: result}));
});

const getSingleUserWithdrawals = catchAsync(async (req, res)=> {
    const withdrawals = await withdrawalService.getSingleUserWithdrawals(req.user.id);
    res.status(httpStatus.OK).json(response({ message:"Withdrawal", status: "OK", statusCode:httpStatus.OK , data: withdrawals}));
});

const withdrawalCancel = catchAsync(async (req, res) => {
    const withdrawal = await withdrawalService.withdrawalCancel(req.params.withdrawalId);
    res.status(httpStatus.OK).json(response({ message:"Withdrawal Cancelled", status: "OK", statusCode:httpStatus.OK , data: withdrawal}));
});

const withdrawalApprove = catchAsync(async (req, res) => {
    const withdrawal = await withdrawalService.withdrawalApprove(req.params.withdrawalId);
    res.status(httpStatus.OK).json(response({ message:"Withdrawal Approved", status: "OK", statusCode:httpStatus.OK , data: withdrawal}));
});


module.exports = {
    createWithdrawal,
    getWithdrawals,
    getSingleUserWithdrawals,
    withdrawalCancel,
    withdrawalApprove
};
