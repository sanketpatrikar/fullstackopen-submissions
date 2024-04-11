import { Person } from "./Person";

export const Phonebook = ({ persons, deletePerson }) => {
    return (
        <>
            <h2>Numbers</h2>
            <table>
                <tbody>
                    {persons.map((person) => (
                        <Person key={person.id} person={person} deletePerson={deletePerson}/>
                    ))}
                </tbody>
            </table>
        </>
    );
};
