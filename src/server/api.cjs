const { 
    addPerson,
    getPersonByID,
    deletePersonByID,
    getPersonsByPage,
    getMatchingRuns,
    getAllMatchesOfRun,
    addWorkspace,
    getAllWorkSpaces,
    getWorkSpacePersonsByPage,
    getPersonWorkspaceRelations,
    updatePersonByID,
    updateAllPersonWorkspaceRelations
} = require("./database/database.cjs");



const fs = require("fs");
const path = require("path");
const { Router } = require("express");
const match = require("nodemon/lib/monitor/match.js");
const {matchAll} = require("./matcher/matcher.cjs");
const api = Router();

//load all random generated names from file
const randomTeamNames = fs.readFileSync(path.join(__dirname, "./randomWorkspaces/randomWorkspaces.txt"), "utf-8").split("\n");

api.use(require('body-parser').urlencoded({ extended: true }));

api.post("/person/create", (req, res) => {
    const { username, first_name, second_name, email } = req.body;
    const result = addPerson(username, first_name, second_name, email);
    res.json({result});
});

api.post("/person/update/:id", (req, res) => {
    const id = req.params.id;
    const { first_name, second_name, email } = req.body;

    const personResult = updatePersonByID(id, first_name, second_name, email);

    updateAllPersonWorkspaceRelations(id, JSON.parse(req.body.workspaces));

    res.json({personResult});
});

api.get("/person/:id", (req, res) => {
    res.json({
        person: getPersonByID(req.params.id),
        workspaces: getPersonWorkspaceRelations(req.params.id),
    });
});

api.delete("/person/:id", (req, res) => {
    res.json(deletePersonByID(req.params.id));
});



api.get("/persons", (req, res) => {
    const { itemsPerPage, page } = req.query;
    res.json(getPersonsByPage(itemsPerPage, page));
});



api.get("/donuts", (req, res) => {
    res.json(getMatchingRuns());
});

api.get("/donut/:id", (req, res) => {
    res.json(getAllMatchesOfRun(req.params.id));
});

api.get("/workspaces", (req, res) => {
    res.json(getAllWorkSpaces());
});

api.get("/workspaces/:id", (req, res) => {
    res.json(getAllWorkSpaces(req.params.id));
});

api.get("/workspaces/members/:id", (req, res) => {
    const { itemsPerPage, page } = req.query;
    res.json(getWorkSpacePersonsByPage(req.params.id, itemsPerPage, page));
});

api.post("/workspaces/create", (req, res) => {
    res.json(addWorkspace(req.body.name, req.body.description));
});

api.get("/workspace/random", (req, res) => {
    res.send(randomTeamNames[Math.floor(Math.random() * randomTeamNames.length)]);
});

api.get("/workspaces/match/:id", (req, res) => {
    res.json(matchAll(req.params.id));
});

module.exports = api;