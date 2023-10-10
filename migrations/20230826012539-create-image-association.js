'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('image_associations', {
			image_id: {
				type: Sequelize.INTEGER,
				unique: 'tt_unique_constraint',
			},
			owner_id: {
				type: Sequelize.INTEGER,
				unique: 'tt_unique_constraint',
				references: null,
			},
			owner_type: {
				type: Sequelize.STRING,
				unique: 'tt_unique_constraint',
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('image_associations');
	},
};
