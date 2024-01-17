const data = require("./MOCK_DATA.json");

console.log(data);

const createPerson = async (person) => {
    const { username, first_name, last_name, email } = person;

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('first_name', first_name);
    formData.append('second_name', last_name);
    formData.append('email', email);

    const response = await fetch('http://localhost:3000/api/person/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });

    // Handle the response if needed
    // const result = await response.json();
    // console.log(result);
};

const processRequests = async () => {
    for (const person of data) {
        await createPerson(person);
    }
};

processRequests();
