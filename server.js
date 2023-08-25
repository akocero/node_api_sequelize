require('dotenv').config();
// import app from './app.js';

const app = require('./src/app.js');
const db = require('./src/v1/models');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err, err.message);
	process.exit(1);
});

(async () => {
	await db.sequelize.sync();

	const port = process.env.PORT || 5000;
	const server = app.listen(port, () => {
		console.log(`App running on port ${port}...`);
	});

	process.on('unhandledRejection', (err) => {
		console.log('UNHANDLED REJECTION! 💥 Shutting down...');
		console.log(err, err.message);
		server.close(() => {
			process.exit(1);
		});
	});

	process.on('SIGTERM', () => {
		console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
		server.close(() => {
			console.log('💥 Process terminated!');
		});
	});

	// Code here
})();
