const mongoose = require('mongoose');

const { Schema } = mongoose;

const BuildingSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	floors: [
		{
			number: {
				type: String,
				required: true,
			},
			gates: [
				{
					number: {
						type: String,
						required: true,
					},
					departments: [String],
				},
			],
		},
	],
});

const Building = mongoose.model('Building', BuildingSchema);

module.exports = Building;