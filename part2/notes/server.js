// Import required modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
	addNote,
	deleteNote,
	getAllNotes,
	getNoteById,
	toggleNoteImportanceById,
} from "./db.js";

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000; // You can change this to any port you prefer

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

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

app.get("/api/notes/:noteID", async (req, res, next) => {
	const noteID = req.params.noteID;

	if (isNaN(noteID)) {
		return res.status(400).send("malformed ID. must be a number");
	}

	try {
		const note = await getNoteById(noteID);
		if (note.rows[0]) {
			res.json(note.rows[0]);
		} else {
			res.sendStatus(404).end();
		}
	} catch (error) {
		next(error);
	}
});

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

// TODO: Implement central error handling

app.put("/api/notes/:noteID", async (req, res) => {
	// Todo: make it possible to also edit `content`
	const noteID = parseInt(req.params.noteID);

	if (isNaN(noteID)) {
		return res.status(400).send("Malformed note ID. Must be a number.");
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
		return res.status(500).send("Internal Server Error");
	}
});

app.delete("/api/notes/:noteID", async (req, res) => {
	const noteID = req.params.noteID;

	if (isNaN(noteID)) {
		return res.status(400).send("Malformed note ID. Must be a number.");
	}

	try {
		const deleted = await deleteNote(noteID);

		if (deleted) {
			return res.sendStatus(204);
		} else {
			return res.sendStatus(204).end();
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

app.use((req, res) => {
	res.status(404).send("Unknown Endpoint");
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
