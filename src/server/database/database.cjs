const path = require('path');


const db = require('better-sqlite3')(path.join(__dirname, "/database.db"), {fileMustExist: true});

const querys = {
    "addPerson": db.prepare("INSERT INTO Persons (username, first_name, second_name, slack_username, created_at) VALUES ($username, $first_name, $second_name, $slack_username, $created_at)"),
    "getUserByID": db.prepare("SELECT * FROM Persons WHERE id=$id"),
    "deleteUserByID": db.prepare("DELETE FROM Persons WHERE id=$id"),
    
    "getPersonsByPage": db.prepare("SELECT * FROM Persons LIMIT $itemsPerPage OFFSET $offset"),
    "getPersonsCount": db.prepare("SELECT COUNT(*) FROM Persons")
}



function addPerson(username, first_name, second_name, slack_username) {
    const created_at = (new Date()).toLocaleDateString();
        
    return querys["addPerson"].run({username, first_name, second_name, slack_username, created_at});
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


module.exports = {
    addPerson,
    getPersonByID,
    deletePersonByID,
    getPersonsByPage
}