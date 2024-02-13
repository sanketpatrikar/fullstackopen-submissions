import { useState } from "react";
import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
    const [people, setPeople] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPeople, setFilteredPeople] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/people")
            .then((response) => {
                setPeople(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const addPerson = (event) => {
        event.preventDefault();

        const newPerson = {
            name: newName,
            number: newNumber,
            id: people.length + 1,
        };

        let personAlreadyExists = people.some(
            (person) => person.name === newPerson.name
        );

        if (personAlreadyExists) {
            alert(`${newPerson.name} already exists`);
        } else {
            setPeople(people.concat(newPerson));
            setNewName("");
            setNewNumber("");
        }
    };

    const handleNameChange = async (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        if (term === "") {
            setPeople(persons);
        } else {
            setPeople(
                people.filter((person) => {
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

            <Phonebook persons={people} />
        </div>
    );
};

export default App;
