import pkg from "pg";
const { Pool } = pkg;

import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const pool = new Pool({
	user: "postgres",
	password: process.env.DB_PASS,
	host: "localhost",
	database: "notes_db",
	port: 5432,
});

export function query(text, params) {
	return pool.query(text, params);
}

export async function getAllNotes() {
	return await query("select * from notes");
}

export async function getNoteById(id) {
	return (await query(`select * from notes where id = ${id}`));
}

export async function addNote(note) {
	return await query(
		`INSERT INTO notes (content, important) VALUES ($1, $2) RETURNING *`,
		[note.content, false]
	);
}

export async function toggleNoteImportanceById(id) {
	try {
		await query(
			`UPDATE NOTES SET important = NOT important WHERE id = ${id}`
		);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
