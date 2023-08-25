const { User: Model } = require('../models');
const BaseService = require('./BaseService');

class UserService extends BaseService {
	Model;
	static className = 'UserService';
	constructor() {
		super(Model);

		this.Model = Model;
		this.with_relation = false;
		this.relations = {};
	}
}

module.exports = UserService;
