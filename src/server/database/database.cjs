const path = require('path');
const bcrypt = require('bcrypt');


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
    "getDonutsForWorkspaceByPage": db.prepare(`SELECT M.id AS match_id, P0.username AS person0_username, P0.first_name AS person0_first_name, P0.second_name AS person0_last_name, P1.username AS person1_username, P1.first_name AS person1_first_name, P1.second_name AS person1_last_name, P2.username AS person2_username, P2.first_name AS person2_first_name, P2.second_name AS person2_last_name, M.created_at, M.workspace FROM Matches M JOIN Persons P0 ON M.person0 = P0.id JOIN Persons P1 ON M.person1 = P1.id LEFT JOIN Persons P2 ON M.person2 = P2.id WHERE M.workspace = $workspace ORDER BY M.id DESC LIMIT $resultsPerPage OFFSET $offset;`),
    "getDonutsForWorkspaceCount": db.prepare("SELECT COUNT(*) FROM Matches WHERE workspace=$workspace"),
    "deletePersonWorkspaceRelation": db.prepare("DELETE FROM Person_in_workspace WHERE person=$person AND workspace=$workspace"),
    "deleteAllPersonWorkspaceRelationsByWorkspace": db.prepare("DELETE FROM Person_in_workspace WHERE workspace=$workspace"),
    "deleteAllPersonWorkspaceRelationsByPerson": db.prepare("DELETE FROM Person_in_workspace WHERE person=$person"),
    "deleteAllMatchesWithPerson": db.prepare("DELETE FROM Matches WHERE person0=$person OR person1=$person OR person2=$person"),
    "deleteDonutsOfWorkspaceByID": db.prepare("DELETE FROM Matches WHERE workspace=$workspace"),
    "deleteWorkSpaceByID": db.prepare("DELETE FROM Workspaces WHERE id=$workspace"),

    "getAccountbyusername": db.prepare("SELECT * FROM Accounts WHERE username=$username"),
    "getAccountsByPage": db.prepare("SELECT id, username, created_at FROM Accounts LIMIT $itemsPerPage OFFSET $offset"),
    "getAccountsCount": db.prepare("SELECT COUNT(*) FROM Accounts"),
    "createAccount": db.prepare("INSERT INTO Accounts (username, password, created_at) VALUES ($username, $password, $created_at)"),
    "deleteAccount": db.prepare("DELETE FROM Accounts WHERE username=$username"),
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
    querys["deleteAllPersonWorkspaceRelationsByPerson"].run({person: id});
    querys["deleteAllMatchesWithPerson"].run({person: id});
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

function getPersonsByPage(itemsPerPage, page, search) {
    const offset = (page - 1) * itemsPerPage;
    if (search === "" || search === null || search === undefined) {
        const results = querys["getPersonsByPage"].all({itemsPerPage, offset});
        const cnt = querys["getPersonsCount"].get();
        return {results, count: cnt["COUNT(*)"]};
    } else {
        search = "'"+escapeSQL(search+"*")+"'";
        const getPersonsByPageAndSearch = db.prepare(`SELECT * FROM PersonsFTS WHERE PersonsFTS MATCH ${search} LIMIT $itemsPerPage OFFSET $offset`);
        const getPersonsByPageAndSearchCount = db.prepare(`SELECT COUNT(*) FROM PersonsFTS WHERE PersonsFTS MATCH ${search}`);

        return {
            results: getPersonsByPageAndSearch.all({itemsPerPage, offset}),
            count: getPersonsByPageAndSearchCount.get()["COUNT(*)"]
        };

    }
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


function registerDonut(match, workspace) {
    const sql2 = "INSERT INTO Matches (person0, person1, workspace, created_at) VALUES ($person1, $person2, $workspace, $created_at)";
    const sql3 = "INSERT INTO Matches (person0, person1, person2, workspace, created_at) VALUES ($person1, $person2, $person3, $workspace, $created_at)";

    const query2 = db.prepare(sql2);
    const query3 = db.prepare(sql3);

    if (match.length === 2) {
        const [person1, person2] = match;

        return query2.run({person1: person1.id, person2: person2.id, workspace, created_at: getDate()});
    } else if (match.length === 3) {
        console.log("MATCH WITH 3")
        const [person1, person2, person3] = match;
        return query3.run({person1: person1.id, person2: person2.id, person3: person3.id, workspace, created_at: getDate()});
    } else {
        throw new Error("Invalid match length");
    }
}

function getDonutsForWorkspaceByPage(workspace, resultsPerPage, page) {
    const offset = (page - 1) * resultsPerPage;
    const results = querys["getDonutsForWorkspaceByPage"].all({workspace, resultsPerPage, offset});
    const count = querys["getDonutsForWorkspaceCount"].get({workspace});

    return {results, count: count["COUNT(*)"]};
}

function deleteDonutsOfWorkspaceByID(workspace) {
    return querys["deleteDonutsOfWorkspaceByID"].run({workspace});
}

function deleteWorkSpaceByID(workspace) {
    deleteDonutsOfWorkspaceByID(workspace);
    querys["deleteAllPersonWorkspaceRelationsByWorkspace"].run({workspace});
    return querys["deleteWorkSpaceByID"].run({workspace});
}

function escapeSQL(str) {
    return str.replace(/'/g, "");
}

async function isValidAccount(username, password) {
    const user = querys["getAccountbyusername"].get({username});

    console.log(user);

    if (!user) {
        return false;
    }

    try {
        const match = await bcrypt.compare(password, user.password);
        return match;
    } catch (error) {
        console.error(`Error comparing passwords: ${error}`);
        return false;
    }
}

function createAccount(username, passwordHash) {
    return querys["createAccount"].run({username, password: passwordHash, created_at: getDate()});
}

function deleteAccount(username) {
    console.info(`Deleting account ${username}`)
    return querys["deleteAccount"].run({username});
}

function getAccountsByPage(itemsPerPage, page) {
    const offset = (page - 1) * itemsPerPage;
    return {
        results: querys["getAccountsByPage"].all({itemsPerPage, offset}),
        count: querys["getAccountsCount"].get()["COUNT(*)"]
    };
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
    getWorkSpacePersons,
    registerDonut,
    getDonutsForWorkspaceByPage,
    deleteDonutsOfWorkspaceByID,
    deleteWorkSpaceByID,
    isValidAccount,
    createAccount,
    deleteAccount,
    getAccountsByPage
}