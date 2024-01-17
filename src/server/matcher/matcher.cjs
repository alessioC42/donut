const {
    getWorkSpacePersons
} = require("../database/database.cjs");


function matchAll(workspaces) {
    let persons = getWorkSpacePersons(workspaces);
    persons = persons.filter(person => person.is_paused === 0);

    let matches = [];

    // Fisher-Yates shuffle algorithm
    for (let i = persons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [persons[i], persons[j]] = [persons[j], persons[i]];
    }

    // Pairing up individuals
    for (let i = 0; i < persons.length; i += 2) {
        let match = [persons[i]];
        if (i + 1 < persons.length) {
            match.push(persons[i + 1]);
        } else if (i + 2 < persons.length) {
            match.push(persons[i + 2]);
        }
        matches.push(match);
    }

    // Check if the last match has only one person and merge with the second-to-last match
    if (matches.length > 1 && matches[matches.length - 1].length === 1) {
        matches[matches.length - 2].push(matches[matches.length - 1][0]);
        matches.pop();
    }

    return matches;
}



module.exports = {
    matchAll
}