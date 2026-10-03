const API_URL = "http://localhost:5000";


// ==================================================
// LOGIN / REGISTER SWITCH
// ==================================================

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const showRegisterButton = document.getElementById("showRegister");
const showLoginButton = document.getElementById("showLogin");

if (showRegisterButton) {
    showRegisterButton.addEventListener("click", () => {
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
    });
}

if (showLoginButton) {
    showLoginButton.addEventListener("click", () => {
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });
}


// ==================================================
// REGISTER
// ==================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;

        const message =
            document.getElementById("registerMessage");

        message.textContent = "Registering...";

        try {

            const response = await fetch(
                `${API_URL}/api/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent =
                    "Registration successful!";

                registerForm.reset();

            } else {

                message.textContent =
                    data.message || "Registration failed.";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Cannot connect to server.";
        }
    });
}


// ==================================================
// LOGIN
// ==================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        message.textContent = "Logging in...";

        try {

            const response = await fetch(
                `${API_URL}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save JWT
                localStorage.setItem(
                    "token",
                    data.token
                );

                // Save user
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                message.textContent =
                    "Login successful!";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 500);

            } else {

                message.textContent =
                    data.message || "Login failed.";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Cannot connect to server.";
        }
    });
}


// ==================================================
// DASHBOARD
// ==================================================

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const dashboardMessage =
    document.getElementById("dashboardMessage");

const logoutButton =
    document.getElementById("logoutButton");


// This only runs on dashboard.html
if (userName && userEmail) {

    const token =
        localStorage.getItem("token");

    // No token
    if (!token) {

        window.location.href = "index.html";

    } else {

        fetch(`${API_URL}/api/dashboard`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        })

        .then(async (response) => {

            const data = await response.json();

            console.log("Dashboard response:", data);

            if (!response.ok) {

                throw new Error(
                    data.message || "Dashboard error"
                );
            }

            return data;
        })

        .then((data) => {

            // Display user information
            userName.textContent =
                data.user.name;

            userEmail.textContent =
                data.user.email;

            dashboardMessage.textContent =
                data.message;

        })

        .catch((error) => {

            console.error(
                "Dashboard error:",
                error
            );

            dashboardMessage.textContent =
                "Unable to load dashboard.";
        });
    }
}


// ==================================================
// LOGOUT
// ==================================================

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";
    });
}