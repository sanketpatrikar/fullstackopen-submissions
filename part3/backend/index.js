const express = require("express");
const app = express();

let notes = [
    { id: 1, content: "HTML is easy", important: true },
    { id: 2, content: "Browser can execute only JavaScript", important: false },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
    res.json(notes);
});

app.get("/api/notes/:noteID", (req, res) => {
    const noteID = req.params.noteID;

    console.log("notes length", notes.length);

    if (noteID < 1 || noteID > notes.length) {
        return res.send("not found").status(404);
    }
    res.json(notes[noteID - 1]);
});

app.post("/api/notes/", (req, res) => {
    const body = req.body;

    if (!note.content) {
        return res.status(404).json({ error: "content missing" });
    }

    const generateID = () => {
        const maxID =
            notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;

        return maxID + 1;
    };

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateID(),
    };

    notes = notes.concat(note);
    res.json(note);
});

app.delete("/api/notes/:noteID", (req, res) => {
    const noteID = Number(req.params.noteID);

    notes = notes.filter((note) => note.id !== noteID);

    res.json(notes);
});

const PORT = 3001;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
