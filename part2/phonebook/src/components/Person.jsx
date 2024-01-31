import React from "react";

export const Person = ({ person }) => {
    return (
        <tr>
            <td>{person.name}</td>
            <td>{person.number}</td>
        </tr>
    );
};
