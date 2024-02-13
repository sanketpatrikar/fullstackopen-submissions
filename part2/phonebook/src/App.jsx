import { useState, useEffect } from "react";
import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import phonebookService from "./services/phonebook";

const App = () => {
    const [people, setPeople] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPeople, setFilteredPeople] = useState(people);
    const [filterApplied, setFilter] = useState(false);

    useEffect(() => {
        phonebookService
            .getAll()
            .then((initialPhonebook) => {
                setPeople(initialPhonebook);
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
        };

        let personAlreadyExists = people.some(
            (person) => person.name === newPerson.name
        );

        if (personAlreadyExists) {
            alert(`${newPerson.name} already exists`);
        } else {
            phonebookService.add(newPerson).then((addedPerson) => {
                setPeople(people.concat(addedPerson));
            });

            setNewName("");
            setNewNumber("");
        }
    };

    const deletePerson = (id) => {
        if (confirm(`Delete ${people[id - 1].name}?`)) {
            phonebookService
                .deletePerson(id)
                .then((modifiedNotes) => setPeople(modifiedNotes));
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

            <Phonebook persons={peopleProps} deletePerson={deletePerson} />
        </div>
    );
};

export default App;
