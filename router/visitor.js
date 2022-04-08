const express = require('express');
const router = express.Router();
const Joi = require('joi');

//importing visitor schema's
const Visitor = require('../models/visitors');

const visitorValidator = Joi.object({
	email: Joi.string().email().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	address: Joi.string().required(),
	phone: Joi.string()
		.required()
		.regex(/^[0-9]{10}$/)
		.message('Phone number must be 10 digits'),
});

/**
 * @route POST /visitor
 * @desc Create a new visitor
 * @access Public
 * @returns {response} Success Message
 * @returns {response} Error
 */

router.post('/', async (req, res) => {
	try {
		let { value, error } = visitorValidator.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			throw error;
		}

		error = {};

		if (await Visitor.findOne({ email: value.email })) {
			error['email'] = 'Email already in use';
		}

		if (await Visitor.findOne({ phone: value.phone })) {
			error['phone'] = 'Phone number already in use';
		}

		if (Object.keys(error).length > 0) {
			throw error;
		}

		await Visitor.create({
			email: value.email,
			firstName: value.firstName,
			lastName: value.lastName,
			address: value.address,
			phone: value.phone,
		});

		res.status(201).send('Successfully Created');
	} catch (err) {
		let errors = err;
		if (err.details) {
			errors = {};
			err.details.forEach((value) => {
				errors[value.path[0]] = value.message.replaceAll('"', '');
			});
		}

		console.log(errors);
		res.status(400).send(errors);
	}
});

/**
 * @route POST /visitor/:email
 * @desc Update a visitor
 * @access Public
 * @returns {response} Success Message
 * @returns {response} Error
 */

router.post('/:email', async (req, res) => {
	try {
		const visitor = await Visitor.findOne({ email: req.params.email });
		if (!visitor) {
			throw {
				'Bad Request': 'Account with this email does not exist',
			};
		}

		let { value, error } = visitorValidator.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			throw error;
		}

		visitor.email = value.email;
		visitor.firstName = value.firstName;
		visitor.lastName = value.lastName;
		visitor.address = value.address;
		visitor.phone = value.phone;
		visitor.save();

		res.status(201).send('Successfully Updated');
	} catch (err) {
		let errors = err;
		if (err.details) {
			errors = {};
			err.details.forEach((value) => {
				errors[value.path[0]] = value.message.replaceAll('"', '');
			});
		}

		console.log(errors);
		res.status(400).send(errors);
	}
});

router.delete('/:email', async (req, res) => {
	try {
		const removeVisitor = await Visitor.deleteOne({
			email: req.params.email,
		});
		return res.status(200).send('Deleted Successfully');
	} catch (err) {
		return res.status(401).json({ err });
	}
});

router.get('/:email', async (req, res) => {
	try {
		const getVisitor = await Visitor.findOne({
			email: req.params.email,
		});
		return res
			.status(200)
			.send({
				email: getVisitor.email,
				firstName: getVisitor.firstName,
				lastName: getVisitor.lastName,
				address: getVisitor.address,
				phone: getVisitor.phone,
			});
	} catch (err) {
		return res.status(401).json({ err });
	}
});

router.get('/', async (req, res) => {
	try {
		const getVisitors = await Visitor.find();
		const visitors = getVisitors.map((visitor) => {
			return {
				email: visitor.email,
				firstName: visitor.firstName,
				lastName: visitor.lastName,
				address: visitor.address,
				phone: visitor.phone,
			}
		});
		return res.status(200).send(visitors);
	} catch (err) {
		return res.status(401).json({ err });
	}
});

module.exports = router;
