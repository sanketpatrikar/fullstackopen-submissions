import React from "react";
import { Person } from "./Person";

export const Phonebook = ({ persons }) => {
    console.log(persons);
    return (
        <>
            <h2>Numbers</h2>
            <table>
                <tbody>
                    {persons.map((person) => (
                        <Person key={person.id} person={person} />
                    ))}
                </tbody>
            </table>
        </>
    );
};
