const BaseController = require('./BaseController');
const filterObject = require('./../utils/filterObject');
const AppError = require('../utils/appError.js');
const { jsonResponse } = require('../utils/responseBuilder');

class UserController extends BaseController {
	async update(req, res, next) {
		const id = req.params.id;

		// filter req.body to prevent updating sensitve data
		const filteredBody = filterObject(
			req.body,
			'first_name',
			'last_name',
			'email',
		);

		const BaseService = new this.BaseService();
		const data = await BaseService.update(id, filteredBody);

		if (!data) {
			return next(
				new AppError('The requested resource was not found', 404),
			);
		}

		const statusCode = 200;
		res.status(statusCode).json(
			jsonResponse(statusCode, 'Resource updated successfully.', data),
		);
		return;
	}
}

module.exports = UserController;
