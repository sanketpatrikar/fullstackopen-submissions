import pkg from "pg";
const { Pool } = pkg;

import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const db = new Pool({
	user: "postgres",
	password: "postgres",
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

export function getEntriesCount() {
	return query("select count(name) from phonebook");
}

// Contact queries

export function getContact(id) {
	return query(`select * from phonebook where id = $1`, [id]);
}

export function addContact(contact) {
	return query(
		`insert into phonebook(name, number) values($1, $2) returning *`,
		[contact.name, contact.number]
	);
}

export function editContact(contact) {
	return query(
		"update phonebook set name = $1, number = $2 where id = $3 returning *",
		[contact.name, contact.number, contact.id]
	);
}

export function deleteContact(id) {
	return query(`delete from phonebook where id = ${id}`);
}
