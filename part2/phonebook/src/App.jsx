import { useState, useEffect } from "react";
import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import phonebookService from "./services/phonebook";
import "./index.css";
import Notification from "./components/Notification";

const App = () => {
    const [people, setPeople] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPeople, setFilteredPeople] = useState(people);
    const [filterApplied, setFilter] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

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
            const shouldReplaceUser = confirm(
                `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
            );

            if (shouldReplaceUser) {
                const personIndex = people.findIndex((person) => {
                    return person.name === newPerson.name;
                });

                phonebookService
                    .update(personIndex, newPerson)
                    .then((updatedPeople) => {
                        setPeople(updatedPeople);
                        setMessageType("success");
                        setMessage(`Updated ${newPerson.name}`);
                        setTimeout(function () {
                            setMessage(null);
                        }, 2000);
                    });
            }
        } else {
            phonebookService.add(newPerson).then((addedPerson) => {
                setPeople(people.concat(addedPerson));
            });

            setNewName("");
            setNewNumber("");
            setMessageType("success");
            setMessage(`Added ${newPerson.name}`);
            setTimeout(function () {
                setMessage(null);
            }, 2000);
        }
    };

    const deletePerson = (id) => {
        console.log("id is", id);
        console.log("person", people[id - 1]);
        if (confirm(`Delete ${people[id - 1].name}?`)) {
            phonebookService.deletePerson(id).then((modifiedNotes) => {
                setPeople(modifiedNotes);
                setMessageType("success");
                setMessage(`Deleted successfully.`);
                setTimeout(function () {
                    setMessage(null);
                }, 2000);
            });
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
            <Notification messageType={messageType} message={message} />
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
