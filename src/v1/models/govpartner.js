'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class GovPartner extends Model {
		static associate(models) {
			this.belongsToMany(models.Image, {
				through: {
					model: models.ImageAssociation,
					unique: false,
					scope: {
						owner_type: 'GovPartner',
					},
				},
				foreignKey: 'owner_id',
				constraints: false,
				as: 'images',
			});
		}
	}
	GovPartner.init(
		{
			title: { type: DataTypes.STRING, allowNull: false },
		},
		{
			underscored: true,
			sequelize,
			modelName: 'GovPartner',
		},
	);
	return GovPartner;
};
