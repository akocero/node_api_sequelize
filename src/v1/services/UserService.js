const { User: Model, Image } = require('../models');
const BaseService = require('./BaseService');

class UserService extends BaseService {
	Model;
	static className = 'UserService';
	constructor() {
		super(Model);

		this.Model = Model;
		this.include = [
			{
				model: Image,
				as: 'images',
				attributes: ['id', 'public_id', 'secure_url'],
				through: { attributes: [] },
			},
		];
	}
}

module.exports = UserService;
