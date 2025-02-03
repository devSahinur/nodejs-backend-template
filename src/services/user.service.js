const httpStatus = require("http-status");
const { User, Interest } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmailVerification } = require("./email.service");
const unlinkImages = require("../common/unlinkImage");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  function generateReferralCode(length = 6) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let referralCode = "";

    for (let i = 0; i < length; i++) {
      referralCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return referralCode;
  }

  const referralCode = generateReferralCode();

  if (userBody.role === "client" || userBody.role === "employee") {
    userBody.referralCode = referralCode;
  }

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (userBody.role === "client" || userBody.role === "employee") {
    sendEmailVerification(userBody.email, oneTimeCode);
  }
  return User.create({ ...userBody, oneTimeCode });
};

const queryUsers = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" || key === "email" || key === "username") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const users = await User.paginate(query, options);

  // Convert height and age to feet/inches here...

  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody, files) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  if (files && files.length > 0) {
    updateBody.photo = files;
  } else {
    delete updateBody.photo; // remove the photo property from the updateBody if no new photo is provided
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const isUpdateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  function generateReferralCode(length = 6) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let referralCode = "";

    for (let i = 0; i < length; i++) {
      referralCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return referralCode;
  }

  const referralCode = generateReferralCode();

  if (updateBody.role === "client" || updateBody.role === "employee") {
    updateBody.referralCode = referralCode;
  }

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (updateBody.role === "client" || updateBody.role === "employee") {
    sendEmailVerification(updateBody.email, oneTimeCode);
  }

  Object.assign(user, updateBody, {
    isDeleted: false,
    isSuspended: false,
    isEmailVerified: false,
    isResetPassword: false,
    isPhoneNumberVerified: false,
    oneTimeCode: oneTimeCode,
  });
  await user.save();
  return user;
};

const verifyNid = async (id, nidNumber) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.nidStatus === "approved") {
    throw new ApiError(httpStatus.BAD_REQUEST, "NID already verified");
  }
  if (user.nidStatus === "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Waiting for admin approval");
  }
  user.nidNumber = nidNumber;
  user.nidStatus= 'pending'
  await user.save();
  return user;
};

const nidVerifyApproval = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.nidStatus === "approved") {
    throw new ApiError(httpStatus.BAD_REQUEST, "NID already verified");
  }
  if (user.nidStatus === "unverified" || user.nidStatus === "cancelled") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User not submitted Nid for approval"
    );
  }
  if (user.nidStatus === "pending") {
    user.nidStatus = "approved";
  }
  await user.save();
  return user;
};

const nidVerifyReject = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.nidStatus !== "cancelled") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "NID verification already cancelled for this user"
    );
  }
  user.nidStatus = "cancelled"; // Assuming "cancelled" is the status when NID verification is cancelled
  await user.save();
  return user;
};

const nidVerifySubmitList = async () => {
  const users = await User.find({ nidStatus: { $eq: "pending" } });
  return users;
};

const interestList = async () => {
  const interest = await Interest.find({});
  return interest;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isUpdateUser,
  verifyNid,
  nidVerifyApproval,
  nidVerifyReject,
  nidVerifySubmitList,
  interestList
};
