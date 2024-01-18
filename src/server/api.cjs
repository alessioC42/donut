const { 
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
    registerDonut,
    getDonutsForWorkspaceByPage,
    deleteDonutsOfWorkspaceByID,
    deleteWorkSpaceByID,
} = require("./database/database.cjs");



const fs = require("fs");
const path = require("path");
const { Router } = require("express");
const {matchAll} = require("./matcher/matcher.cjs");
const {sendMail} = require("./mailer/mailer.cjs");
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
    const { itemsPerPage, page, search } = req.query;
    res.json(getPersonsByPage(itemsPerPage, page, search));
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

api.get("/workspace/matches/:id", (req, res) => {
    const { itemsPerPage, page } = req.query;
    res.json(getDonutsForWorkspaceByPage(req.params.id, itemsPerPage, page));
});

api.post("/workspaces/match/:id", async (req, res)  => {
    const matches = matchAll(req.params.id);
    for (const match of matches) {
        try {
            await sendMail(match);
            registerDonut(match, req.params.id);
        } catch (e) {
            console.error(e);
        }
    }

    res.json(matches);
});

api.delete("/workspaces/donuts/delete/:id", (req, res) => {
    res.json(deleteDonutsOfWorkspaceByID(req.params.id));
});

api.delete("/workspaces/delete/:id", (req, res) => {
    res.json(deleteWorkSpaceByID(req.params.id));
});

module.exports = api;