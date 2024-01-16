const { 
    addPerson,
    getPersonByID,
    deletePersonByID,
    getPersonsByPage
} = require("./database.cjs");


const { Router } = require("express");
const api = Router();
api.use(require('body-parser').urlencoded({ extended: true }));


api.post("/person/create", (req, res) => {
    try {
        const { username, first_name, second_name, email } = req.body;
        const result = addPerson(username, first_name, second_name, email);
        res.json({result});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

api.get("/person/:id", (req, res) => {
    res.json(getPersonByID(req.params.id));
});

api.delete("/person/:id", (req, res) => {
    res.json(deletePersonByID(req.params.id));
});



api.get("/persons", (req, res) => {
    const { itemsPerPage, page } = req.query;
    res.json(getPersonsByPage(itemsPerPage, page));
});


module.exports = api;