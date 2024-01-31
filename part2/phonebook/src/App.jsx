import { useState } from "react";
import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";

const App = () => {
    const [persons, setPersons] = useState([
        { name: "Arto Hellas", number: "39-44-5323523", id: 1 },
        { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
        { name: "Dan Abramov", number: "12-43-234345", id: 3 },
        { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    ]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPeople, setFilteredPeople] = useState([]);

    const addPerson = (event) => {
        event.preventDefault();
        const newPerson = {
            name: newName,
            number: newNumber,
            id: persons.length + 1,
        };
        let personAlreadyExists = persons.some(
            (person) => person.name === newPerson.name
        );

        if (personAlreadyExists) {
            alert(`${newPerson.name} already exists`);
        } else {
            setPersons(persons.concat(newPerson));
            setNewName("");
            setNewNumber("");
            setFilteredPeople(persons);
        }
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        if (term === "") {
            setFilteredPeople(persons);
        } else {
            setFilteredPeople(
                persons.filter((person) => {
                    if (
                        person.name.toLowerCase().includes(term.toLowerCase())
                    ) {
                        return person;
                    }
                })
            );
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter handleSearchChange={handleSearchChange} />

            <h2>add a new</h2>
            <PersonForm
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                addPerson={addPerson}
            />

            <Phonebook persons={filteredPeople} />
        </div>
    );
};

export default App;
