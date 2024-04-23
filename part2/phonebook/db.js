import pkg from "pg";
const { Pool } = pkg;

import { createClient } from "@supabase/supabase-js";
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

const supabaseUrl = "https://elifcfxzhfuqhyuoynjm.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaWZjZnh6aGZ1cWh5dW95bmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5MTg2NDUsImV4cCI6MjAyODQ5NDY0NX0.j9cS36JsMLRxjthTpmD5VwSUzNs9YPUe1bMUbIfEprY";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPhonebook() {
	return await supabase.rpc("get_phonebook");
}

export async function getEntriesCount() {
	return await supabase.rpc("get_entry_count");
}

// Contact queries

export async function getContact(id) {
	return await supabase.rpc("get_entry_by_id", { contactid: id });
}

export async function addContact(contact) {
	return await supabase.rpc("add_contact", { added_contact: contact });
}

export async function editContact(contact) {
	return await supabase.rpc("edit_contact", { edited_contact: contact });
}

export async function deleteContact(id) {
	return await supabase.rpc("delete_contact", { contactid: id})
}
