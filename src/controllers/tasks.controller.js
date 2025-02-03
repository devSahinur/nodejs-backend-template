const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { tasksService } = require("../services");
const { Service } = require("../models");
const ApiError = require("../utils/ApiError");

const createTask = catchAsync(async (req, res) => {
  const task = await tasksService.createTask(req.user.id, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Created Successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const getTask = catchAsync(async (req, res) => {
  const blog = await tasksService.getTaskById(req.params.taskId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task",
      status: "OK",
      statusCode: httpStatus.OK,
      data: blog,
    })
  );
});

const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await tasksService.queryTasks(
    filter,
    options,
    req.user.type,
    req.user.id
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const deleteTask = catchAsync(async (req, res) => {
  const blog = await crewService.deleteCrewById(req.params.crewId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task Deleted Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: blog,
    })
  );
});

const homeServiceList = catchAsync(async (req, res) => {
  const service = await Service.find();
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const getAdminTasks = catchAsync(async (req, res) => {
  const result = await tasksService.getAdminTasks(req.user.id,req.query.type,req.query.page,req.query.limit);
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const taskHome = catchAsync(async (req, res) => {
  const result = await tasksService.taskHome(
    req.user.id,
    req.query.type,
    req.query.page,
    req.query.limit
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const taskRegister = catchAsync(async (req, res) => {
  const result = await tasksService.taskRegister(
  req.user.id,req.body
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const taskSubmit = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload images");
  }

  const image = [];
  if (req.files) {
    req.files.forEach((file) => {
      const url = `/uploads/submitTask/${file.filename}`;
      image.push({
        url,
        path: file.filename,
      });
      // console.log(files);
    });
  }

  if (!image) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload images");
  } else {
    const result = await tasksService.taskSubmit(req.user.id, req.body.submitTaskId,image);
    res.status(httpStatus.OK).json(
      response({
        message: "All Tasks",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  }

  // const result = await tasksService.taskSubmit(req.user.id, req.query.type, req.query.page, req.query.limit);
  // res.status(httpStatus.OK).json(
  //   response({
  //     message: "All Tasks",
  //     status: "OK",
  //     statusCode: httpStatus.OK,
  //     data: result,
  //   })
  // );
});

const getEmployeeTasks = catchAsync(async (req, res) => {
  const result = await tasksService.getEmployeeTasks(
    req.user.id,
    req.query.status,
    req.query.page,
    req.query.limit
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getSubmittedTasks= catchAsync(async (req, res) => {
  const result = await tasksService.getSubmittedTasks(
    req.query.status,
    req.query.page,
    req.query.limit
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const submitTaskUpdate = catchAsync(async (req, res) => {
  const result = await tasksService.submitTaskUpdate(req.query.id,req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getRegisterSingleTask = catchAsync(async (req, res) => {
  const result = await tasksService.getRegisterSingleTask(req.query.id);
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});


module.exports = {
  createTask,
  getTask,
  getTasks,
  deleteTask,
  homeServiceList,
  getAdminTasks,
  taskHome,
  taskRegister,
  taskSubmit,
  getEmployeeTasks,
  getSubmittedTasks,
  submitTaskUpdate,
  getRegisterSingleTask
};
