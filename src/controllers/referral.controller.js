const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { User, Referral } = require("../models");

const claimed = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const referralCode = req.body.referralCode;

  // Find the user with the referral code
  const claimedUser = await User.findOne({ referralCode });

  console.log("claimedUser", claimedUser, referralCode);

  // Check if referral has already been claimed
  const referralClaimed = await Referral.findOne({ referralCode });

  if (referralClaimed) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Referral Already Claimed");
  }

  // Check if claimedUser exists
  if (!claimedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Referral Code");
  }

  // Create Referral document
  const referral = await Referral.create({
    userId: req.user._id,
    claimedUserId: claimedUser._id,
    referralCode: referralCode,
  });

  // Update user and claimedUser
  user.referralCode = referralCode;
  user.referralClaimed = true;
  await user.save();

  // Increment claimedUser's rand
  claimedUser.rand += 1;
  await claimedUser.save();

  return res.status(httpStatus.OK).json(
    response({
      message: "Referral Claimed",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const  myReferrals = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const referrals = await Referral.find({ claimedUserId: user._id }).populate("userId").select("-createdAt -updatedAt -__v");
  const totalReferrals = await Referral.countDocuments({ claimedUserId: user._id });
  return res.status(httpStatus.OK).json(
    response({
      message: "My Referrals",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {referrals, totalReferrals},
    })
  );
});


module.exports = {
  claimed,
  myReferrals
};
