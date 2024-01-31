import React from "react";

export const Filter = ({ handleSearchChange }) => {
    return (
        <div>
            filter shown with:{" "}
            <input type="text" onChange={handleSearchChange} />
        </div>
    );
};
