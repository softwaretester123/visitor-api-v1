const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const Visitation = require('../models/visitation');

const visitationValidator = Joi.object({
	visitor: Joi.string().required(),
	building: Joi.string().required(),
	floor_no: Joi.number().required(),
	gate_no: Joi.string().required(),
	department: Joi.string().required(),
	visit_date: Joi.date().required(),
});

router.post('/', async (req, res) => {
	try {
		let { value, error } = await visitationValidator.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			throw error;
		}
		Visitation.create({
			...value,
		});
		return res.status(200).send('Successfully Created Visitation');
	} catch (err) {
		let errors = err;
		if (err.details) {
			errors = {};
			err.details.forEach((value) => {
				errors[value.path[0]] = value.message.replaceAll('"', '');
			});
		}

		res.status(400).send(errors);
	}
});

router.delete('/:id', async (req, res) => {
    try {
        await Visitation.findByIdAndDelete(req.params.id);
        res.status(200).send('Successfully Deleted');
    } catch (err) { 
        res.status(400).json({ err });
    }
});

module.exports = router;