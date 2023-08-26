const { ImageAssociation: Model } = require('../models');
const { Image } = require('../models');

class ImageAssocHelper {
	Model;
	static className = 'ImageAssocHelper';
	constructor(owner) {
		this.Model = Model;
		this.owner_id = owner.id;
		this.owner_type = owner.type;
	}

	async attach(images_id) {
		let images = [];

		if (!Array.isArray(images_id)) {
			console.log('not array: ');
			images.push(images_id);
		} else {
			images = images_id;
			console.log('array: ');
		}

		images = images.map((id) => {
			return {
				owner_type: this.owner_type,
				owner_id: this.owner_id,
				image_id: id,
			};
		});

		console.log('IMAGES: ', images, images_id);

		await this.Model.bulkCreate(images);
	}

	async detach() {
		await this.Model.destroy({
			where: {
				owner_type: this.owner_type,
				owner_id: this.owner_id,
			},
		});
	}

	async sync(images_id) {
		await this.detach();
		await this.attach(images_id);
	}
}

module.exports = ImageAssocHelper;
