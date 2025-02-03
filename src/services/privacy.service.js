const httpStatus = require('http-status');
const { Privacy } = require('../models');
const ApiError = require('../utils/ApiError');
const he = require('he');


const createPrivacy = async (privacyBody) => {

    privacyBody.content = he.decode(privacyBody.content);
   
    const existingPrivacy = await Privacy.findOne();

    if (existingPrivacy) {
        // If an entry exists, update it
        existingPrivacy.set(privacyBody);
        await existingPrivacy.save();
        return existingPrivacy;
    } else {
        // If no entry exists, create a new one
        const newPrivacy = await Privacy.create(privacyBody);
        return newPrivacy;
    }
};

const queryPrivacy = async () => {
    const privacy = await Privacy.find();
    return privacy;
};


module.exports = {
    createPrivacy,
    queryPrivacy
};