const httpStatus = require("http-status");
const { Terms } = require("../models");
const ApiError = require("../utils/ApiError");
const he = require("he");

const createTerms = async (termsBody) => {
  termsBody.content = he.decode(termsBody.content);
  const existingTerms = await Terms.findOne();

  if (existingTerms) {
    // If an entry exists, update it
    existingTerms.set(termsBody);
    await existingTerms.save();
    return existingTerms;
  } else {
    // If no entry exists, create a new one
    const newTerms = await Terms.create(termsBody);
    return newTerms;
  }
};

const queryTerms = async () => {
  const terms = await Terms.find();
  return terms;
};

module.exports = {
  createTerms,
  queryTerms,
};
