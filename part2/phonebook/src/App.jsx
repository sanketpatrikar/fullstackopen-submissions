import { useState, useEffect } from "react";
import { Phonebook } from "./components/Phonebook";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import Notification from "./components/Notification";
import phonebookService from "./services/phonebook";
import "./index.css";

const App = () => {
	const [people, setPeople] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filteredPeople, setFilteredPeople] = useState(people);
	const [filterApplied, setFilter] = useState(false);
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState(null);

	useEffect(() => {
		updateUsersOnClient();
	}, []);

	const updateUsersOnClient = async () => {
		phonebookService
			.getAll()
			.then((initialPhonebook) => {
				setPeople(initialPhonebook);
			})
			.catch((error) => {
				console.error(error);
				setMessageType("error");
				setMessage(`Couldn't get users: ${error}`);
				setTimeout(function () {
					setMessage(null);
				}, 2000);
			});
	};

	const addPerson = (event) => {
		event.preventDefault();

		const newPerson = {
			name: newName,
			number: newNumber,
		};

		if (!newPerson.name || !newPerson.number) {
			setMessageType("error");
			setMessage(`Cannot add person without name / number`);
			setTimeout(function () {
				setMessage(null);
			}, 2000);
			return;
		}

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
						updateUsersOnClient();
					})
					.catch((error) => {
						setMessageType("error");
						setMessage(`Couldn't update contact: ${error}`);
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
			updateUsersOnClient();
		}
	};

	const deletePerson = async (personID) => {
		try {
			await phonebookService.deletePerson(personID);
			setPeople(people.filter((person) => person.id !== personID));
		} catch (error) {
			console.log(error);
			setMessageType("error");
			setMessage(`Person couldn't be deleted: ${error}`);
			setTimeout(function () {
				setMessage(null);
			}, 2000);
		}
	};

	const handleNameChange = async (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

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

			<Phonebook
				persons={filterApplied ? filteredPeople : people}
				deletePerson={deletePerson}
			/>
		</div>
	);
};

export default App;
