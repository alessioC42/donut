const express = require("express");
const cors = require("cors");
const path = require("path");

const api = require("./database/api.cjs");

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use("/api", api);

app.use("/", express.static(path.join(__dirname, "../dist")))

app.listen(port, () => {
    console.log("Server listening on port", port);
});