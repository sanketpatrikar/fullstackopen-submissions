import pkg from "pg";
const { Pool } = pkg;

// const { createClient } = require('@supabase/supabase-js');
import { createClient } from "@supabase/supabase-js";



import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const supabaseUrl = 'https://elifcfxzhfuqhyuoynjm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaWZjZnh6aGZ1cWh5dW95bmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5MTg2NDUsImV4cCI6MjAyODQ5NDY0NX0.j9cS36JsMLRxjthTpmD5VwSUzNs9YPUe1bMUbIfEprY';
const supabaseUser = 'postgres.elifcfxzhfuqhyuoynjm';
const supabasePassword = 'u8qCw$Kt%yFSa2vY4b*g3';
const supabaseDatabase = 'postgres';

const supabase = createClient(supabaseUrl, supabaseKey);

export function query(text, params) {
	return supabase.query(text, params);
}

export async function getAllNotes() {
	return await query("select * from notes");
}

export async function getNoteById(id) {
	return await query(`select * from notes where id = ${id}`);
}

export async function addNote(note) {
	return await query(
		`INSERT INTO notes (content, important) VALUES ($1, $2) RETURNING *`,
		[note.content, false]
	);
}

export async function updateNote(note) {
	try {
		await query(
			`UPDATE NOTES SET content = $1, important = $2 where id = $3 returning *`,
			[note.content, note.important, note.id]
		);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function deleteNote(id) {
	try {
		await query(`DELETE from notes where id = ${id}`);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
