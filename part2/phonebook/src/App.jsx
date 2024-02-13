import { useState, useEffect } from "react";
import axios from "axios";

import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";

const App = () => {
    const [people, setPeople] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPeople, setFilteredPeople] = useState(people);
    const [filterApplied, setFilter] = useState(false);

    const baseUrl = "http://localhost:5000";

    useEffect(() => {
        axios
            .get(`${baseUrl}/people`)
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

    const peopleProps = filterApplied ? filteredPeople : people;

    const handleSearchChange = (event) => {
        const searchedName = event.target.value;

        switch (searchedName) {
            case "":
            case " ":
            case undefined:
            case null:
                setFilter(false);
                break;
            default:
                setFilteredPeople(
                    people.filter((person) => {
                        if (
                            person.name
                                .toLowerCase()
                                .includes(searchedName.toLowerCase())
                        ) {
                            return person;
                        }
                    })
                );
                setFilter(true);
                break;
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

            <Phonebook persons={peopleProps} />
        </div>
    );
};

export default App;
