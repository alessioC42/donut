const Nylas = require('nylas');
const { default: Draft } = require('nylas/lib/models/draft');
const config = require("../../config.json");
const fs = require("fs");
const path = require("path");

Nylas.config({
    clientId: config.NYLAS_CLIENT_ID,
    clientSecret: config.NYLAS_CLIENT_SECRET,
    apiServer: config.NYLAS_API_SERVER,
});

const nylas = Nylas.with(config.NYLAS_ACCESS_TOKEN);


const htmlTemplate = fs.readFileSync(path.join(__dirname, "template.html"), "utf-8");



async function sendMail(match) {
    let userCards = "";

    let to = [];

    for (const person of match) {
        console.log(person);
        let username = escapeHTML(person.username);
        let email = escapeHTML(person.email);
        userCards += `<div class="user-card">
            <h3>${escapeHTML(username)}</h3>
            <a href="mailto:${(email)}">${email}</a>
        </div>`

        if (config.MAIL_DEBUG) {
            tp.push({ name: "Hallo Welt", email: config.MAIL_DEBUG_ADDRESS });
        } else {
            to.push({ name: username, email: email+".none" });
        }
    }
    const html = htmlTemplate.replace("<!-- USER CARDS HERE -->", userCards);
    const draft = new Draft(nylas, {
        subject: "Time for a Donut?",
        body: html,
        to: to,
    });
    try {
        const message = await draft.send();
        console.log(message.subject+" sent");
    } catch (_e) {
        console.error("Error sending message "+draft.subject);
    }
}

sendMail(
    [{"id":7,"username":"aethington2","first_name":"Abel","second_name":"Ethington","email":"aethington2@mapquest.com","created_at":"1/17/2024","is_paused":0},
        {"id":15,"username":"fpolglasea","first_name":"Ferdinande","second_name":"Polglase","email":"fpolglasea@nbcnews.com","created_at":"1/17/2024","is_paused":0}]);

// function to prevent html injections
function escapeHTML() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}