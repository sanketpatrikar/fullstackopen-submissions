import axios from "axios";
import Note from "./components/Note";
import noteService from "./services/notes";
import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import Notification from "./components/Notification";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const hook = () => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    };

    const toggleImportanceOf = (id) => {
        const note = notes.find((note) => note.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(
                    notes.map((note) => {
                        return note.id !== id ? note : returnedNote;
                    })
                );
            })
            .catch(() => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                );
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((note) => note.id !== id));
            });
    };

    useEffect(hook, []);
    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important === true);

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        };

        noteService
            .create(noteObject)
            .then((returnedNote) => {
                setNotes(notes.concat(returnedNote));
                setNewNote("");
            })
            .catch((error) => console.error(error));
    };

    const handleNoteChange = (event) => {
        console.log(event.target.value);
        setNewNote(event.target.value);
    };

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default App;
