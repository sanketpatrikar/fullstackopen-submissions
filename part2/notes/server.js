// Import required modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
	addNote,
	deleteNote,
	getAllNotes,
	getNoteById,
	updateNote,
} from "./db.js";

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000; // You can change this to any port you prefer

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Define a route that returns the JSON
app.get("/api/notes", async (req, res, next) => {
	try {
		const notes = await getAllNotes();
		res.json(notes.rows);
	} catch (error) {
		next(error);
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

app.post("/api/notes", async (req, res, next) => {
	try {
		const note = req.body;
		if (!note.content) {
			return res.status(404).json({ error: "content missing" });
		}
		const addedNote = (await addNote(note)).rows[0];
		console.log(addedNote);
		res.status(201).send(addedNote);
	} catch (error) {
		next(error);
	}
});

app.put("/api/notes/:noteID", async (req, res, next) => {
	const noteID = parseInt(req.params.noteID);

	if (isNaN(noteID)) {
		return res.status(400).send("Malformed note ID. Must be a number.");
	}

	const updatedNote = req.body;

	try {
		const updated = await updateNote(updatedNote);
		if (updated) {
			return res.sendStatus(200);
		} else {
			return res.status(401).send("Couldn't toggle importance");
		}
	} catch (error) {
		next(error);
	}
});

app.delete("/api/notes/:noteID", async (req, res, next) => {
	const noteID = req.params.noteID;

	if (isNaN(noteID)) {
		return res.status(400).send("Malformed note ID. Must be a number.");
	}

	try {
		const deleted = await deleteNote(noteID);

		if (deleted) {
			return res.sendStatus(204).end();
		} else {
			return res.sendStatus(204).end();
		}
	} catch (error) {
		next(error);
	}
});

app.use((req, res) => {
	res.status(404).send("Unknown Endpoint");
});

const errorHandler = (error, req, res, next) => {
	console.error(error);

	switch (error) {
		case error.name === "CastError":
		case error.name === "ValidationError":
			return res.status(400).json({ error: "Malformed ID" });
		case error.routine === "ExecConstraints":
			return res.status(400).json({ error: error.message });
		default:
			break;
	}

	next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
