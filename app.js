//importing required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

// route imports
const visitor = require('./router/visitor');
const build = require('./router/buildings');
const visitation = require('./router/visitation');

app.use(cors());
app.use(express.json());
app.use('/visitor', visitor);
app.use('/buildings', build);
app.use('/visitation', visitation);

const { DB_URI, PORT } = process.env;

const start = () => {
	mongoose
		.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('✅ Connected to database');
		});
	app.listen(PORT, () => {
		console.log(`🔴 Server started on port ${PORT}`);
	});
};

start();
