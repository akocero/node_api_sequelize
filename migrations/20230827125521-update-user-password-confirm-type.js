'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('users', 'password_confirm', {
			type: Sequelize.STRING,
		});

		// Update rows with NULL values to have valid values
		await queryInterface.sequelize.query(
			'UPDATE users SET password_confirm = "default_value" WHERE password_confirm IS NULL',
		);

		await queryInterface.changeColumn('users', 'password_confirm', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('users', 'password_confirm', {
			type: Sequelize.STRING,
		});
	},
};
