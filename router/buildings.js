const { Router } = require('express');

const Building = require('../models/buildings');

const router = new Router();

/**
 * @params building name, floor name
 */

router.post('/', async (req, res) => {
	try {
		const building = await new Building({
			name: req.body.name,
			floors: req.body.floors,
		});

		await building.save();

		res.status(200).json({
			message: 'Building created successfully',
		});
	} catch (err) {
		res.status(400).json({
			message: err.message,
		});
	}
});

router.get('/', async (req, res) => {
	try {
		const buildings = await Building.find();

		res.status(200).json({ buildings });
	} catch (err) {
		res.status(400).json({
			message: err.message,
		});
	}
});

router.delete('/:building', async (req, res) => {
	try {
		const name = req.params.building;
		await Building.deleteOne({ name: name });
	} catch (err) {
		res.status(400).json({
			message: err.message,
		});
	}
});

// route to create gate
router.post('/add_gate/:building/:floor/:gate', async (req, res) => {
	try {
		const building = req.params.building;
		const floor = req.params.floor;
		const gate = req.params.gate;

		const new_gate = {
			number: gate,
			departments: req.body.departments ? req.body.departments : [],
		};

		const deleted_building = await Building.findOneAndUpdate(
			{ name: building, 'floors.number': floor },
			{ $pull: { 'floors.$[].gates': { number: gate } } }
		);

		const new_building = await Building.findOneAndUpdate(
			{ name: building, 'floors.number': floor },
			{ $push: { 'floors.$[].gates': new_gate } } // $[] is positional selector used to select array elements.
		);
		return res.status(200).json({ mesage: 'success' });
	} catch (err) {
		return res.status(400).json({ err: err.message });
	}
});

// route to delete gate
router.delete('/gate/:building/:floor/:gate', async (req, res) => {
	try {
		const building = req.params.building;
		const floor = req.params.floor;
		const gate = req.params.gate;

		console.log(building, floor, gate);
		// delete gate from building
		const deleted_building = await Building.findOneAndUpdate(
			{ name: building, 'floors.number': floor },
			{ $pull: { 'floors.$[].gates': { number: gate } } }
		);

		return res.status(200).json({ message: 'Gate Deleted' });
	} catch (err) {
		return res.status(400).json({ err: err.message });
	}
});

// route to create department
router.post(
	'/add_gate/:building/:floor/:gate/:department',
	async (req, res) => {
		try {
			const building = req.params.building;
			const floor = req.params.floor;
			const gate = req.params.gate;
			const department = req.params.department;

			console.log(building, floor, gate, department);
			// create department in building
			const new_building = await Building.findOneAndUpdate(
				{
					name: building,
					'floors.number': floor,
					'floors.gates.number': gate,
				},
				{ $push: { 'floors.$[].gates.$[].departments': department } }
			);

			if (!new_building) {
				const building_exists = await Building.findOne({
					name: building,
				});
				if (!building_exists) {
					return res.status(403).json({
						message: `Building ${building} does not exist`,
					});
				}

				const floor_exists = await Building.findOne({
					name: building,
					'floors.number': floor,
				});
				if (!floor_exists) {
					return res.status(403).json({
						message: `Floor ${floor} does not exist in ${building} building`,
					});
				}

				const gate_exists = await Building.findOne({
					name: building,
					'floors.number': floor,
					'floors.gates.number': gate,
				});
				if (!gate_exists) {
					return res.status(403).json({
						message: `Gate ${gate} does not exist in floor ${floor}`,
					});
				}
			}

			return res.status(200).json({ message: 'successfully' });
		} catch (err) {
			return res.status(400).json({ err: err.message });
		}
	}
);

//route to delete departemnt
router.delete(
	'/department/:building/:floor/:gate/:department',
	async (req, res) => {
		try {
			const building = req.params.building;
			const floor = req.params.floor;
			const gate = req.params.gate;
			const department = req.params.department;

			console.log(building, floor, gate, department);
			// delete department from building
			const deleted_building = await Building.findOneAndUpdate(
				{
					name: building,
					'floors.number': floor,
					'floors.gates.number': gate,
				},
				{ $pull: { 'floors.$[].gates.$[].departments': department } }
			);

			return res.status(200).json({
				message: `successfully deleted ${department} department from gate number ${gate}`,
			});
		} catch (err) {
			return res.status(400).json({ err: err.message });
		}
	}
);

module.exports = router;
