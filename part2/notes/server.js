// Import required modules
import express from "express";
import helmet from "helmet";
// const helmet = require('helmet');
import fs from "node:fs/promises";

// Create an Express application
const app = express();
const port = 5000; // You can change this to any port you prefer

const filePath = "./db.json";

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", "'unsafe-inline'"],
        },
    })
);

// Define a route that returns the JSON
app.get("/notes", async (req, res) => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading or parsing the file");
    }
});

app.get("/notes/:noteID", async (req, res) => {
    const noteID = req.params.noteID;

    if (isNaN(noteID)) {
        return res.status(500).send("Invalid note ID. Must be a number.");
    }

    try {
        const data = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(data);

        if (noteID >= 0 && noteID <= jsonData.length) {
            res.send(jsonData[noteID - 1]);
        } else {
            res.status(404).send("No note of this ID was found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading or parsing the file");
    }
});

app.use(express.json());

app.post("/notes", async (req, res) => {
    try {
        const receivedNote = req.body;
        const data = await fs.readFile(filePath, "utf-8");
        const allNotes = JSON.parse(data);

        receivedNote.id = `${allNotes.length + 1}`;
        allNotes.push(receivedNote);
        await fs.writeFile(filePath, JSON.stringify(allNotes));

        res.status(201).send(receivedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.put("/notes/:noteID", async (req, res) => {
    const noteID = req.params.noteID;

    if (isNaN(noteID)) {
        return res.status(500).send("Invalid note ID. Must be a number.");
    }

    try {
        const data = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(data);

        if (noteID >= 0 && noteID <= jsonData.length) {
            jsonData[noteID - 1] = req.body;
            await fs.writeFile(filePath, JSON.stringify(jsonData));
            return res.status(200).send(jsonData[noteID - 1]);
        }
        else {
            return res.status(404).send('Not Found!!!');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/notes`);
});
