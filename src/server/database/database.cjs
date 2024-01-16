const path = require('path');


const db = require('better-sqlite3')(path.join(__dirname, "/database.db"), {fileMustExist: true});

const querys = {
    "addPerson": db.prepare("INSERT INTO Persons (username, first_name, second_name, email, created_at) VALUES ($username, $first_name, $second_name, $email, $created_at)"),
    "getUserByID": db.prepare("SELECT * FROM Persons WHERE id=$id"),
    "deleteUserByID": db.prepare("DELETE FROM Persons WHERE id=$id"),
    
    "getPersonsByPage": db.prepare("SELECT * FROM Persons LIMIT $itemsPerPage OFFSET $offset"),
    "getPersonsCount": db.prepare("SELECT COUNT(*) FROM Persons"),

    "getMatchingRuns": db.prepare("SELECT * FROM Matching_runs;"),
    "getAllMatchesOfRun": db.prepare(`SELECT Matches.id, Matches.person0, Matches.person1, Matches.created_at, Matches.matching_run, 
                                        Persons0.username as person0_username, Persons0.first_name as person0_first_name, Persons0.second_name as person0_second_name, Persons0.email as person0_email, Persons0.created_at as person0_created_at,
                                        Persons1.username as person1_username, Persons1.first_name as person1_first_name, Persons1.second_name as person1_second_name, Persons1.email as person1_email, Persons1.created_at as person1_created_at
                                      FROM Matches
                                      JOIN Persons as Persons0 ON Matches.person0 = Persons0.id
                                      JOIN Persons as Persons1 ON Matches.person1 = Persons1.id
                                      WHERE Matches.matching_run = $id;`),

    "addWorkspace": db.prepare("INSERT INTO Workspaces (name, description, created_at) VALUES ($name, $description, $created_at)"),
    "getAllWorkSpaces": db.prepare("SELECT * FROM Workspaces;"),
    "getWorkSpaceByID": db.prepare("SELECT * FROM Workspaces WHERE id=$id"),
}

function getDate() {
    return (new Date()).toLocaleDateString();
}



function addPerson(username, first_name, second_name, email) {
    return querys["addPerson"].run({username, first_name, second_name, email, created_at: getDate()});
}

function getPersonByID(id) {
    return querys["getUserByID"].get({id: id});
}

function deletePersonByID(id) {
    return querys["deleteUserByID"].run({id: id});
}

function getPersonsByPage(itemsPerPage, page) {
    const offset = (page - 1) * itemsPerPage;
    const results = querys["getPersonsByPage"].all({itemsPerPage, offset});
    const cnt = querys["getPersonsCount"].get();
    return {results, count: cnt["COUNT(*)"]};
}

function getMatchingRuns() {
    return querys["getMatchingRuns"].all();
}

function getAllMatchesOfRun(id) {
    return querys["getAllMatchesOfRun"].all({id});
}



function addWorkspace(name, description) {
    return querys["addWorkspace"].run({name, description, created_at: getDate()});
}

function getAllWorkSpaces(id=undefined) {
    if (id) {
        return querys["getWorkSpaceByID"].get({id});
    } else {
        return querys["getAllWorkSpaces"].all();
    }
}

function getWorkSpacePersonsByPage(id, resultsPerPage, page) {
    const offset = (page - 1) * resultsPerPage;

    let sql = `SELECT Persons.* 
                FROM Person_in_workspace 
                LEFT JOIN Persons ON Person_in_workspace.person = Persons.id
                WHERE Person_in_workspace.workspace = $id
               LIMIT $resultsPerPage OFFSET $offset`;

    let stmt = db.prepare(sql);
    const results = stmt.all({id, resultsPerPage, offset});

    return {results, count: 1};
}

module.exports = {
    addPerson,
    getPersonByID,
    deletePersonByID,
    getPersonsByPage,
    getMatchingRuns,
    getAllMatchesOfRun,
    addWorkspace,
    getAllWorkSpaces,
    getWorkSpacePersonsByPage,
}