import pkg from "pg";
const { Pool } = pkg;

import { createClient } from "@supabase/supabase-js";
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const supabaseUrl = "https://elifcfxzhfuqhyuoynjm.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaWZjZnh6aGZ1cWh5dW95bmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5MTg2NDUsImV4cCI6MjAyODQ5NDY0NX0.j9cS36JsMLRxjthTpmD5VwSUzNs9YPUe1bMUbIfEprY";

const supabase = createClient(supabaseUrl, supabaseKey);

export function query(text, params) {
	return supabase.query(text, params);
}

export async function getAllNotes() {
	return await supabase.rpc("get_all_notes");
}

export async function getNoteById(id) {
	return await supabase.rpc("get_note_by_id", { note_id: id });
}

export async function addNote(note) {
	return await supabase.rpc("add_note", { new_note: note });
}

export async function updateNote(note) {
	return await supabase.rpc("update_note", { updated_note: note });
}

export async function deleteNote(id) {
	try {
		await supabase.rpc("delete_note", { note_id: id });
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
