const { Op } = require('sequelize');

class SequelizeQueryBuilder {
	constructor(model, reqQuery) {
		this.model = model;
		this.reqQuery = reqQuery;
		this.filterOptions = {};
		this.orderOptions = [['createdAt', 'DESC']];
		this.attributesOptions = { exclude: ['__v'] };
		this.paginationOptions = { page: 1, limit: 20 };
	}

	filter() {
		const queryObj = { ...this.reqQuery };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);

		// Convert operators
		for (const key in queryObj) {
			if (Object.prototype.hasOwnProperty.call(queryObj, key)) {
				queryObj[key] = { [Op.eq]: queryObj[key] };
			}
		}

		this.filterOptions = queryObj;
		return this;
	}

	sort() {
		if (this.reqQuery.sort) {
			const sortBy = this.reqQuery.sort.split(',').join(' ');
			this.orderOptions = [sortBy];
		}
		return this;
	}

	limitFields() {
		if (this.reqQuery.fields) {
			const fields = this.reqQuery.fields
				.split(',')
				.map((field) => field.trim());
			this.attributesOptions = { include: fields };
		}
		return this;
	}

	paginate() {
		const page = this.reqQuery.page * 1 || 1;
		const limit = this.reqQuery.limit * 1 || 20;
		const offset = (page - 1) * limit;

		this.paginationOptions = { page, limit, offset };
		return this;
	}

	async getResults() {
		const results = await this.model.findAll({
			where: this.filterOptions,
			attributes: this.attributesOptions,
			order: this.orderOptions,
			...this.paginationOptions,
		});
		return results;
	}
}

module.exports = SequelizeQueryBuilder;
