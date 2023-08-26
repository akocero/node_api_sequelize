/**
 * @file base_service.js
 * @brief This is the base service where all the other services inherit the base functionality
 * @author Eugene Paul Badato
 */

const SequelizeQueryBuilder = require('../utils/SequelizeQueryBuilder.js');
const PaginationHelper = require('../helpers/PaginationHelper.js');

class BaseService {
	static className = 'BaseService';
	constructor(Model) {
		this.Model = Model;
		this.SequelizeQueryBuilder = SequelizeQueryBuilder;
		this.PagnationHelper = PaginationHelper;
	}

	/**
	 * Reads all the entries in the table
	 * Returns an array of models
	 * @returns rows
	 */
	async readAll() {
		const data = await this.Model.findAll({
			include: this.include,
		});
		return data;
	}

	/**
	 * Reads all the entries in the table with filters and pagination
	 * Returns an array of models
	 * @returns rows
	 */
	async readAllCustom(queryString) {
		let data;
		let query = new this.SequelizeQueryBuilder(this.Model, queryString)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		data = await query.getResults(this.include);

		if (queryString.page) {
			const pagination_helper = new this.PagnationHelper(
				this.Model,
				data,
				query,
			);

			data = await pagination_helper.paginateData();
		}

		return data;
	}

	/**
	 * Returns the newly inserted row if successful
	 * @param {*} modelObject
	 * @returns
	 */
	async create(payload) {
		const data = await this.Model.create(payload);

		if (this.has_images && payload.images) {
			await data.addImages(payload.images);
		}

		return data;
	}

	/**
	 * Reads a row by the id
	 * @param {*} id
	 * @returns Array of rows or null
	 */
	async readById(id) {
		const data = await this.Model.findOne({
			where: {
				id,
			},
			include: this.include,
		});

		if (!data) {
			return false;
		}

		return data;
	}

	/**
	 * Update the given row with the given id
	 * @param {*} id
	 * @param {*} modelObject
	 * @returns true or false
	 */
	async update(id, payload) {
		const user = await this.readById(id);

		if (!user) {
			return false;
		}

		const data = await user.update(payload);

		if (!data) {
			return false;
		}

		if (this.has_images && payload.images) {
			await data.setImages(payload.images);
		}

		const updatedData = await this.readById(id);

		return updatedData;
	}

	/**
	 * Delete a row with the given id
	 * @param {*} id
	 * @returns boolean
	 */
	async delete(id) {}
}

module.exports = BaseService;
