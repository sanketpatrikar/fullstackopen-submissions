import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

import pkg from "pg";
const { Pool } = pkg;

const db = new Pool({
	user: "postgres",
	password: process.env.DB_PASS,
	host: "localhost",
	database: "phonebook_db",
	port: "5432",
});

export function query(text, params) {
	return db.query(text, params);
}

export function getPhonebook() {
	return query("select * from phonebook");
}

export function addContact(contact) {
	return query(
		`insert into phonebook(name, number) values($1, $2) returning *`,
		[contact.name, contact.number]
	);
}
