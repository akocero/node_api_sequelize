'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Image extends Model {
		static associate(models) {
			this.belongsToMany(models.GovPartner, {
				through: {
					model: models.ImageAssociation,
					unique: false,
				},
				foreignKey: 'image_id',
				constraints: false,
			});

			this.belongsToMany(models.User, {
				through: {
					model: models.ImageAssociation,
					unique: false,
				},
				foreignKey: 'image_id',
				constraints: false,
			});
		}
	}
	Image.init(
		{
			public_id: { type: DataTypes.STRING, allowNull: false },
			secure_url: { type: DataTypes.STRING, allowNull: false },
			width: {
				type: DataTypes.INTEGER,
			},
			height: {
				type: DataTypes.INTEGER,
			},
		},
		{
			underscored: true,
			sequelize,
			modelName: 'Image',
		},
	);
	return Image;
};
