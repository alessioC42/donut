const path = require('path');


const db = require('better-sqlite3')(path.join(__dirname, "/database.db"), {fileMustExist: true});

const querys = {
    "addPerson": db.prepare("INSERT INTO Persons (username, first_name, second_name, slack_username, created_at) VALUES ($username, $first_name, $second_name, $slack_username, $created_at)"),
    "getUserByID": db.prepare("SELECT * FROM Persons WHERE id=$id"),
    "deleteUserByID": db.prepare("DELETE FROM Persons WHERE id=$id")
}



function addPerson(username, first_name, second_name, slack_username) {
    const created_at = Date.now();
    return querys["addPerson"].run({username, first_name, second_name, slack_username, created_at});
}

function getPersonByID(id) {
    return querys["getUserByID"].get({id: id});
}

function deletePersonByID(id) {
    return querys["deleteUserByID"].run({id: id});
}


module.exports = {
    addPerson,
    getPersonByID,
    deletePersonByID
}