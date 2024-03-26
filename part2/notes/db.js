import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
	user: "postgres",
	password: "postgres",
	host: "localhost",
	database: "notes_db",
	port: 5432,
});

export function query(text, params) {
	return pool.query(text, params);
}
