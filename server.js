require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Start the server and attach a friendly error handler for common startup errors
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT environment variable.`);
		console.error('To see the process currently using the port (PowerShell):');
		console.error('  netstat -ano | Select-String ":' + PORT + '"');
		console.error('Then kill it with:');
		console.error('  taskkill /PID <PID> /F');
		process.exit(1);
	}
	console.error('Server error:', err);
	process.exit(1);
});
