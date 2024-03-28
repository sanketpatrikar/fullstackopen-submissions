// Import required modules
import express from "express";
import cors from "cors";
import {
	addNote,
	getAllNotes,
	getNoteById,
	toggleNoteImportanceById,
} from "./db.js";

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000; // You can change this to any port you prefer

app.use(cors());

// Define a route that returns the JSON
app.get("/api/notes", async (req, res) => {
	try {
		const notes = await getAllNotes();
		res.json(notes.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/api/notes/:noteID", async (req, res) => {
	const noteID = req.params.noteID;

	if (isNaN(noteID)) {
		return res.status(500).send("Invalid note ID. Must be a number.");
	}

	try {
		const note = await getNoteById(noteID);
		if (note.rows[0]) {
			res.json(note.rows[0]);
		} else {
			res.sendStatus(404).end();
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.use(express.json());

app.post("/api/notes", async (req, res) => {
	try {
		const note = req.body;
		const addedNote = (await addNote(note)).rows[0];
		res.status(201).send(addedNote);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

app.put("/api/notes/:noteID", async (req, res) => {
	const noteID = parseInt(req.params.noteID);

	if (isNaN(noteID)) {
		return res.status(400).send("Invalid note ID. Must be a number.");
	}

	try {
		const toggled = await toggleNoteImportanceById(noteID);
		if (toggled) {
			return res.sendStatus(200);
		} else {
			return res.status(401).send("Couldn't toggle importance");
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal server error.");
	}
});

app.use(express.static("dist"));

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
