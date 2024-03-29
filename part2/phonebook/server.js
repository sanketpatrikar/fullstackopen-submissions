// Import required modules
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express, { query } from "express";
import fs from "node:fs/promises";
import morgan from "morgan";
import { addContact, getPhonebook } from "./db.js";

// Create an Express application
const app = express();
const PORT = 5000; // You can change this to any port you prefer

const filePath = "./db.json";

// ? path.join(__dirname, "public", "db.json")
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
app.get("/api/people", async (req, res) => {
	// console.log("dir:", path.dirname(fileURLToPath(import.meta.url)));
	try {
		const data = await getPhonebook();
		res.json(data.rows);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error reading the file");
	}
});

app.get("/api/people/:personID", async (req, res) => {
	const personID = req.params.personID;
	try {
		const data = await fs.readFile(filePath, "utf-8");
		let jsonData = await JSON.parse(data);
		return res.send(jsonData[personID - 1]);
	} catch (error) {
		console.error(error);
	}
});

app.get("/info", async (req, res) => {
	const data = await fs.readFile(filePath, "utf-8");
	const notes = await JSON.parse(data);
	res.send(
		`<p>Phonebook has info for ${notes.length}</p>
        <p>${new Date()}</p>`
	);
});

app.post("/api/people", async (req, res) => {
	const receivedPerson = req.body;
	try {
		if (!receivedPerson.name || !receivedPerson.number) {
			return res.json({ error: "name / number must be given" });
		}

		// const data = await fs.readFile(filePath, "utf-8");
		// let jsonData = await JSON.parse(data);

		// const personAlreadyExists = jsonData.some(
		// 	(person) => person.name === receivedPerson.name
		// );

		// if (personAlreadyExists) {
		// 	return res.json({ error: "name must be unique" });
		// }

		// receivedPerson.id = jsonData.length + 1;

		// jsonData.push(receivedPerson);

		// jsonData = await fixIdOrder(jsonData);

		// await fs.writeFile(filePath, JSON.stringify(jsonData));

		const addedPerson = await addContact(receivedPerson);

		res.status(201).send(addedPerson);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Error reading the file or data");
	}
});

app.put("/api/people/:personID", async (req, res) => {
	const personID = req.params.personID;
	const modifiedPerson = req.body;

	try {
		const data = await fs.readFile(filePath, "utf-8");
		let jsonData = await JSON.parse(data);

		if (!jsonData[personID]) {
			return;
		}

		jsonData.splice(personID, 1, modifiedPerson);

		jsonData = await fixIdOrder(jsonData);

		return res.send(jsonData);
	} catch (error) {
		console.error(error);
	}
});

app.delete("/api/people/:personID", async (req, res) => {
	const personID = req.params.personID;

	try {
		const data = await fs.readFile(filePath, "utf-8");
		let jsonData = await JSON.parse(data);

		const indexOfPerson = jsonData.findIndex((person) => {
			return person.id === parseInt(personID);
		});

		jsonData.splice(indexOfPerson, 1);

		jsonData = await fixIdOrder(jsonData);

		await fs.writeFile(filePath, JSON.stringify(jsonData));

		return res.send(jsonData);
	} catch (error) {
		console.error(error);
	}
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("dist/"));
app.use(unknownEndpoint);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}/api/people`);
});

const fixIdOrder = async (people) => {
	await people.forEach((person, index) => {
		people[index].id = index + 1;
	});

	return people;
};
