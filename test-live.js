async function testLiveAuth() {
    const API_URL = "https://amul-shop-backend.onrender.com";
    const uniqueEmail = `test_tenant_${Date.now()}@amulshop.com`;
    const password = "securepassword123";

    console.log("-----------------------------------------");
    console.log(`[1] Testing Registration & Token Generation`);
    console.log("-----------------------------------------");

    let token = "";
    try {
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Tenant A", email: uniqueEmail, password })
        });

        const regData = await regRes.json();
        if (regRes.status !== 201) {
            console.error("❌ Registration Failed. Render is likely still building the backend.", regData);
            return;
        }

        token = regData.token;
        console.log("✅ Registration Successful! Received JWT:", token.substring(0, 20) + "...");

        console.log("\n-----------------------------------------");
        console.log(`[2] Testing Authenticated Product Creation`);
        console.log("-----------------------------------------");

        const prodRes = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                sku: `SKU-${Date.now()}`,
                name: "Tenant A Special Milk",
                category: "Milk",
                price: 100,
                stockLevel: 50
            })
        });

        const prodData = await prodRes.json();

        if (prodRes.status === 201) {
            console.log("✅ Product Created Successfully inside Tenant Database!");
            console.log("Response:", prodData);
        } else {
            console.error("❌ Product Creation Failed.", prodData);
        }

    } catch (e) {
        console.error("❌ Fetch Error. Server is still deploying...", e.message);
    }
}

testLiveAuth();
