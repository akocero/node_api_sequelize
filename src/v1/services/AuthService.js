const { User: Model } = require('../models');
const BaseService = require('./BaseService');
const jwt = require('jsonwebtoken');
const Email = require('../helpers/EmailHelper.js');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthService extends BaseService {
	Model;
	static className = 'AuthService';
	constructor() {
		super(Model);

		this.Model = Model;
		this.with_relation = false;
		this.relations = {};
	}

	// pass and object to query
	async findOneWithPass(whereQry) {
		const user = await this.Model.findOne({
			where: whereQry,
			attributes: {
				include: ['password'],
			},
		});

		return user;
	}

	async findOne(whereQry) {
		const user = await this.Model.findOne({
			where: whereQry,
		});

		return user;
	}

	async login(email, password) {
		const user = await this.findOneWithPass({ email });

		if (!user) {
			return false;
		}

		const is_password_match = await user.comparePassword(
			password,
			user.password,
		);

		if (!is_password_match) {
			return false;
		}

		const token = this.createToken(user.id);

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
		};
	}

	async updatePassword({ id, password, new_password, password_confirm }) {
		const user = await this.findOneWithPass({ id });

		if (!user) {
			return false;
		}

		const is_password_match = await user.comparePassword(
			password,
			user.password,
		);

		if (!is_password_match) {
			return false;
		}

		user.password = new_password;
		user.password_confirm = password_confirm;
		await user.save();

		const token = this.createToken(user.id);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token,
		};
	}

	async findByEmail(email) {
		const user = await this.findOne({ email });

		if (!user) {
			return false;
		}

		return user;
	}

	async register({
		first_name,
		last_name,
		email,
		password,
		password_confirm,
	}) {
		const user = await this.Model.create({
			first_name,
			last_name,
			email,
			password,
			password_confirm,
		});

		if (!user) {
			return false;
		}

		const token = this.createToken(user.id);

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
		};
	}

	async selfUpdate(id, payload) {
		const user = await this.findOne({ id });

		const updatedUser = await user.update(payload);

		return updatedUser;
	}

	async forgotPassword(user, origin) {
		// populate to user passwordResetToken and PasswordResetTokenExpires
		const resetToken = user.createPasswordResetToken();

		// req.headers.origin it will work only at system request not on postman
		const resetURL = `${origin}/auth/reset_password/${resetToken}`;

		try {
			await new Email({ email: user.email }).sendPasswordReset(resetURL);

			await user.save({ validate: false });

			return resetToken;
		} catch (err) {
			return false;
		}
	}

	async resetPassword(reset_password_token, password, password_confirm) {
		const hashedToken = crypto
			.createHash('sha256')
			.update(reset_password_token)
			.digest('hex');

		const user = await this.Model.findOne({
			where: {
				password_reset_token: hashedToken,
				password_reset_expires: { [Op.gt]: new Date() },
			},
		});

		if (!user) {
			return false;
		}

		user.password = password;
		user.password_confirm = password_confirm;
		user.password_reset_token = undefined;
		user.password_reset_expires = undefined;

		await user.save();

		return true;
	}

	async selfDeactivate(id) {
		const user = await this.Model.findByIdAndUpdate(id, { active: false });

		if (!user) {
			return false;
		}

		return true;
	}

	createToken(id) {
		return jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});
	}
}

module.exports = AuthService;
