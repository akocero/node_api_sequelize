'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsToMany(models.Image, {
				through: {
					model: models.ImageAssociation,
					unique: false,
					scope: {
						owner_type: 'User',
					},
				},
				foreignKey: 'owner_id',
				constraints: false,
				as: 'images',
			});
		}

		async comparePassword(candidatePassword, userPassword) {
			return await bcrypt.compare(candidatePassword, userPassword);
		}

		changedPasswordAfter(JWTTimestamp) {
			if (this.password_changed_at) {
				const changedTimestamp = parseInt(
					this.password_changed_at.getTime() / 1000,
					10,
				);

				return JWTTimestamp < changedTimestamp;
			}

			// False means NOT changed
			return false;
		}

		createPasswordResetToken() {
			const resetToken = crypto.randomBytes(32).toString('hex');

			this.password_reset_token = crypto
				.createHash('sha256')
				.update(resetToken)
				.digest('hex');

			this.password_reset_expires = Date.now() + 10 * 60 * 1000;

			return resetToken;
		}
	}

	User.init(
		{
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
				set(value) {
					// Convert the value to lowercase before saving
					this.setDataValue('first_name', value.toLowerCase());
				},
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
				set(value) {
					// Convert the value to lowercase before saving
					this.setDataValue('last_name', value.toLowerCase());
				},
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			password: { type: DataTypes.STRING, allowNull: false },
			password_confirm: { type: DataTypes.STRING, allowNull: true },
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'user',
				validate: {
					isIn: {
						args: [['user', 'admin']],
						msg: 'Role must be either "user" or "admin".',
					},
				},
			},
			password_changed_at: DataTypes.DATE,
			password_reset_token: DataTypes.STRING,
			password_reset_expires: DataTypes.DATE,
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		},

		{
			sequelize,
			underscored: true,
			modelName: 'User',
			indexes: [{ unique: true, fields: ['email'] }],
			defaultScope: {
				attributes: {
					exclude: ['password', 'password_reset_token'],
				},
			},
		},
	);

	User.beforeCreate(async (user, options) => {
		console.log('beforeCreate RUNNN!!!');
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		// Delete passwordConfirm field before saving
		user.password_confirm = null;
	});

	User.beforeUpdate(async (user, options) => {
		console.log('beforeUpdate RUNNN!!!');

		if (!user.changed('password')) return;

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		// Delete passwordConfirm field before saving
		user.password_confirm = null;

		user.password_changed_at = Date.now() - 1000;
	});

	return User;
};
