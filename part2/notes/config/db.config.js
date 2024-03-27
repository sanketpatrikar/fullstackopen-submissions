// config/db.config.js
export const config = {
	host: "localhost",
	user: "postgres",
	password: process.env.DB_PASS,
	database: "notes_db",
	port: 5432, // Optional, default is 5432
};
