const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { Withdrawal } = require("../models");
const { userService } = require(".");

const createWithdrawal = async (userId, body) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (body.withdrawalAmount < 20) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Minimum withdrawal amount is 20"
    );
  }
  if (body.withdrawalAmount > 10000) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Maximum withdrawal amount is 10000"
    );
  }

  if (user.rand < body.withdrawalAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }
  user.rand = user.rand - body.withdrawalAmount;
  await user.save();

  const withdrawal = await Withdrawal.create({ ...body, userId });
  return withdrawal;
};

const withdrawalCancel = async (withdrawalId) => {
  const withdrawal = await Withdrawal.findOne({ _id: withdrawalId });
  const user = await userService.getUserById(withdrawal.userId);
  if(withdrawal.status === "Completed") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Withdrawal already completed");
  }
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Withdrawal not found");
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  withdrawal.status = "Failed";
  user.rand = user.rand + withdrawal.withdrawalAmount;
  await user.save();
  await withdrawal.save();
  return withdrawal;
};

const queryWithdrawals = async (status, filter, providedOptions) => {
  if (status) {
      filter.status = status;
  }

  // Merge provided options with default options
  const options = Object.assign({
      sortBy: 'createdAt:desc',
      limit: 10,
      page: 1,
      populate: 'userId', // Populate the userId field
  }, providedOptions);

  // Call Withdrawal.paginate() with provided filter and options
  const withdrawals = await Withdrawal.paginate(filter, options);
  return withdrawals;
};


const getSingleUserWithdrawals = async (userId) => {
  const withdrawals = await Withdrawal.find({ userId })
    .populate("userId", "email fullName image rand role")
    .sort({ createdAt: -1 });
  return withdrawals;
};

const withdrawalApprove = async (withdrawalId) => {
  const withdrawal = await Withdrawal.findOne({ _id: withdrawalId });
  const user = await userService.getUserById(withdrawal.userId);
  console.log("withdrawal", withdrawal);
  console.log("user", user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Withdrawal not found");
  }
  withdrawal.status = "Completed";
  await withdrawal.save();
  return withdrawal;
};

module.exports = {
  createWithdrawal,
  queryWithdrawals,
  withdrawalCancel,
  getSingleUserWithdrawals,
  withdrawalApprove,
};
