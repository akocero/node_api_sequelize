const BaseController = require('./BaseController');
const filterObject = require('./../utils/filterObject');
const AppError = require('../utils/appError.js');
const { jsonResponse } = require('../utils/responseBuilder');

class GovPartnerController extends BaseController {}

module.exports = GovPartnerController;
