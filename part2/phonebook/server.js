// Import required modules
import express from "express";
import morgan from "morgan";
import {
	addContact,
	deleteContact,
	editContact,
	getContact,
	getEntriesCount,
	getPhonebook,
} from "./db.js";

// Create an Express application
const app = express();
const PORT = 5000; // You can change this to any port you prefer

app.use(express.static("./dist"));
app.use(express.json());

morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

// Define a route that returns the JSON
app.get("/api/people", async (req, res, next) => {
	try {
		const phonebook = await getPhonebook();
		res.json(phonebook.data);
	} catch (error) {
		next(error);
	}
});

app.post("/api/people", async (req, res, next) => {
	const receivedPerson = req.body;
	try {
		if (!receivedPerson.name || !receivedPerson.number) {
			return res.sendStatus(400);
		}

		const addedPerson = (await addContact(receivedPerson)).data[0];
		res.status(201).json(addedPerson);
	} catch (error) {
		next(error);
	}
});

app.get("/api/people/:personID", async (req, res, next) => {
	const personID = parseInt(req.params.personID);
	try {
		const personData = (await getContact(personID)).data[0];

		if (personData) {
			res.send(personData);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		next(error);
	}
});

app.put("/api/people/:personID", async (req, res, next) => {
	const modifiedPerson = req.body;

	try {
		const editedContact = (await editContact(modifiedPerson)).data[0];

		if (editedContact) {
			res.send(editedContact);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		next(error);
	}
});

app.delete("/api/people/:personID", async (req, res, next) => {
	const personID = req.params.personID;

	try {
		await deleteContact(personID);
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

app.get("/info", async (req, res, next) => {
	const entryCount = (await getEntriesCount()).data;
	try {
		res.send(
			`<p>Phonebook has info for ${entryCount} people</p>
			 <p>${new Date()}</p>`
	);
	} catch (error) {
		next(error);
	}
});

const unknownEndpoint = (req, res, next) => {
	try {
		res.status(404).send({ error: "unknown endpoint" });
	} catch (error) {
		next(error);
	}
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.error(error.stack);

	if (error.name === "CastError") {
		return res.status(400).json({ error: "Malformed ID" });
	} else {
		next(error);
	}
};

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}/api/people`);
});
