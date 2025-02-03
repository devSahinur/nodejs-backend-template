const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const taskRoute = require("./tasks.routes");
const referralRoute = require("./referral.routes");
const termsRoute = require("./terms.routes");
const privacyRoute = require("./privacy.routes");
const aboutRoute = require("./about.routes");
const withdrawalRoute = require("./withdrawal.routes");
const paymentRoute = require("./payment.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/tasks",
    route: taskRoute,
  },
  {
    path: "/referral",
    route: referralRoute,
  },
  {
    path: "/terms",
    route: termsRoute,
  },
  {
    path: "/privacy",
    route: privacyRoute,
  },
  {
    path: "/about",
    route: aboutRoute,
  },
  {
    path: "/withdrawal",
    route: withdrawalRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
