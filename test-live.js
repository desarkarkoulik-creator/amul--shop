async function testLiveBackend() {
    const API_URL = "https://amul-shop-backend.onrender.com";
    const uniqueEmail = `test_${Date.now()}@amulshop.com`;
    const password = "securepassword123";

    console.log("-----------------------------------------");
    console.log(`[1] Testing Registration: ${uniqueEmail}`);
    console.log("-----------------------------------------");

    try {
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Live Tester", email: uniqueEmail, password })
        });

        const regData = await regRes.json();
        console.log(`Status: ${regRes.status}`);
        console.log("Response:", regData);

        if (regRes.status !== 201) {
            console.error("❌ Registration Failed. The backend might still be building or database isn't connected.");
            return;
        }
        console.log("✅ Registration Successful!");

        console.log("\n-----------------------------------------");
        console.log(`[2] Testing Login: ${uniqueEmail}`);
        console.log("-----------------------------------------");

        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: uniqueEmail, password })
        });

        const loginData = await loginRes.json();
        console.log(`Status: ${loginRes.status}`);
        console.log("Response:", loginData);

        if (loginRes.status === 200) {
            console.log("✅ Login Successful! Global PostgreSQL database is working perfectly.");
        } else {
            console.error("❌ Login Failed.");
        }

    } catch (e) {
        console.error("❌ Network or Fetch Error. The server is likely still turning on or building.", e.message);
    }
}

testLiveBackend();
