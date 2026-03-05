const fetch = require('node-fetch');

async function test() {
    console.log("Registering user");
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Tester", email: "test" + Date.now() + "@test.com", password: "password123" })
    });
    const regBody = await regRes.json();
    console.log("Reg Status:", regRes.status, regBody);

    const email = regBody.user ? regBody.user.email : null;
    if (!email) return console.log("Failed to register");

    console.log("Logging in user");
    const logRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: "password123" })
    });
    const logBody = await logRes.json();
    console.log("Log Status:", logRes.status, logBody);
}

test();
