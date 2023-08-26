'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ImageAssociation extends Model {
		static associate(models) {}
	}
	ImageAssociation.init(
		{
			image_id: {
				type: DataTypes.INTEGER,
				unique: 'tt_unique_constraint',
			},
			owner_id: {
				type: DataTypes.INTEGER,
				unique: 'tt_unique_constraint',
				references: null,
			},
			owner_type: {
				type: DataTypes.STRING,
				unique: 'tt_unique_constraint',
			},
		},
		{
			underscored: true,
			sequelize,
			modelName: 'ImageAssociation',
		},
	);
	return ImageAssociation;
};
