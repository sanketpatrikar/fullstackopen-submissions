import React from "react";

export const PersonForm = (props) => {
    const { handleNameChange, handleNumberChange, addPerson } = props;
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input onChange={handleNameChange} />
            </div>
            <div>
                number: <input onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};
