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
    if (config.MAIL_DEBUG !== "NONE") {
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

            if (config.MAIL_DEBUG === "TRUE") {
                to.push({ name: "Hallo Welt", email: config.MAIL_DEBUG_ADDRESS });
            } else {
                to.push({ name: username, email: email+".debug" });
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

}


// function to prevent html injections
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

module.exports = {
    sendMail
}