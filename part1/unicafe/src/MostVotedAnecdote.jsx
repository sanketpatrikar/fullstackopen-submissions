import React from "react";

export const MostVotedAnecdote = ({ anecdotes, votes }) => {
    const maxVotes = Math.max(...votes);
    const maxVotesIndex = votes.indexOf(maxVotes);
	console.log(maxVotesIndex);
    return (
        <>
            <h1>Anecdote with most vote</h1>
            <p>{anecdotes[maxVotesIndex]}</p>
        </>
    );
};
