const path = require('path');


const db = require('better-sqlite3')(path.join(__dirname, "/database.db"), {fileMustExist: true});

const querys = {
    "addPerson": db.prepare("INSERT INTO Persons (username, first_name, second_name, email, created_at) VALUES ($username, $first_name, $second_name, $email, $created_at)"),
    "getPersonByID": db.prepare("SELECT * FROM Persons WHERE id=$id"),
    "deletePersonByID": db.prepare("DELETE FROM Persons WHERE id=$id"),
    
    "getPersonsByPage": db.prepare("SELECT * FROM Persons LIMIT $itemsPerPage OFFSET $offset"),
    "getPersonsCount": db.prepare("SELECT COUNT(*) FROM Persons"),
    "getPersonWorkspaceRelations": db.prepare(
    `SELECT
         Workspaces.id,
         Workspaces.name,
         Workspaces.created_at,
         CAST(Person_in_workspace.person IS NOT NULL AS BOOLEAN) AS is_member,
         Person_in_workspace.is_paused
     FROM
         Workspaces
             LEFT JOIN
         Person_in_workspace ON Workspaces.id = Person_in_workspace.workspace AND Person_in_workspace.person = $id;
    ;`
    ),

    "updatePersonByID": db.prepare("UPDATE Persons SET first_name=$first_name, second_name=$second_name, email=$email WHERE id=$id"),

    "addWorkspace": db.prepare("INSERT INTO Workspaces (name, description, created_at) VALUES ($name, $description, $created_at)"),
    "getAllWorkSpaces": db.prepare("SELECT * FROM Workspaces;"),
    "getWorkSpaceByID": db.prepare("SELECT * FROM Workspaces WHERE id=$id"),
    "getWorkSpacePersons": db.prepare("SELECT Persons.*, Person_in_workspace.is_paused FROM Person_in_workspace LEFT JOIN Persons ON Person_in_workspace.person = Persons.id WHERE Person_in_workspace.workspace = $id"),
    "getWorkSpacePersonsByPage": db.prepare("SELECT Persons.*, Person_in_workspace.is_paused FROM Person_in_workspace LEFT JOIN Persons ON Person_in_workspace.person = Persons.id WHERE Person_in_workspace.workspace = $id LIMIT $resultsPerPage OFFSET $offset"),
    "getWorkSpacePersonsCount": db.prepare("SELECT COUNT(*) FROM Person_in_workspace WHERE workspace = $id"),
    "addOrUpdatePersonWorkspaceRelation": db.prepare("INSERT OR REPLACE INTO Person_in_workspace (person, workspace, is_paused) VALUES ($person, $workspace, $is_paused);"),
    "deletePersonWorkspaceRelation": db.prepare("DELETE FROM Person_in_workspace WHERE person=$person AND workspace=$workspace"),
}

function getDate() {
    return (new Date()).toLocaleDateString();
}

function addPerson(username, first_name, second_name, email) {
    return querys["addPerson"].run({username, first_name, second_name, email, created_at: getDate()});
}

function getPersonByID(id) {
    return querys["getPersonByID"].get({id: id});
}

function deletePersonByID(id) {
    return querys["deletePersonByID"].run({id: id});
}

function updatePersonByID(id, first_name, second_name, email) {
    return querys["updatePersonByID"].run({id, first_name, second_name, email});
}

function updateAllPersonWorkspaceRelations(person, workspaces) {
    workspaces.forEach(workspace => {
        if (workspace.is_member) {
            querys["addOrUpdatePersonWorkspaceRelation"].run({person, workspace: workspace.id, is_paused: workspace.is_paused ? 1:0});
        } else {
            querys["deletePersonWorkspaceRelation"].run({person, workspace: workspace.id});
        }
    });
}

function getPersonsByPage(itemsPerPage, page) {
    const offset = (page - 1) * itemsPerPage;
    const results = querys["getPersonsByPage"].all({itemsPerPage, offset});
    const cnt = querys["getPersonsCount"].get();
    return {results, count: cnt["COUNT(*)"]};
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

function getWorkSpacePersons(id) {
    return querys["getWorkSpacePersons"].all({id});
}

function getWorkSpacePersonsByPage(id, resultsPerPage, page) {
    const offset = (page - 1) * resultsPerPage;
    
    const results = querys["getWorkSpacePersonsByPage"].all({id, resultsPerPage, offset});
    const count = querys["getWorkSpacePersonsCount"].get({id});

    return {results, count: count["COUNT(*)"]};
}

function getPersonWorkspaceRelations(id) {
    return querys["getPersonWorkspaceRelations"].all({id});
}

module.exports = {
    addPerson,
    getPersonByID,
    deletePersonByID,
    getPersonsByPage,
    addWorkspace,
    getAllWorkSpaces,
    getWorkSpacePersonsByPage,
    getPersonWorkspaceRelations,
    updatePersonByID,
    updateAllPersonWorkspaceRelations,
    getWorkSpacePersons
}