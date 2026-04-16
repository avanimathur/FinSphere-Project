/* =========================
   CONFIG
========================= */
const API_URL = "/api";
let isLogin = true;

/* =========================
   TOGGLE LOGIN / SIGNUP
========================= */
function toggleForm(forceMode = null) {
  if (forceMode !== null) {
    isLogin = forceMode;
  } else {
    isLogin = !isLogin;
  }

  const formTitle = document.getElementById("form-title");
  const mainButton = document.querySelector(".auth-card button");
  const nameField = document.getElementById("name");
  const toggleText = document.getElementById("toggle-text");

  // Guard for pages that include script.js but do not have auth form elements
  if (!formTitle || !mainButton || !nameField || !toggleText) {
    return;
  }

  const extraFields = [
    "college",
    "company",
    "role",
    "employmentType",
    "stipend",
    "ctc",
    "city"
  ];

  if (isLogin) {
    // LOGIN MODE
    formTitle.innerText = "Welcome Back";
    mainButton.innerText = "Login";

    nameField.style.display = "none";
    extraFields.forEach(id => {
      document.getElementById(id).style.display = "none";
    });

    toggleText.innerHTML = `
      Don’t have an account?
      <span onclick="toggleForm(false)">Sign up</span>
    `;

  } else {
    // SIGNUP MODE
    formTitle.innerText = "Create Account";
    mainButton.innerText = "Sign Up";

    nameField.style.display = "block";
    extraFields.forEach(id => {
      document.getElementById(id).style.display = "block";
    });

    toggleText.innerHTML = `
      Have an account?
      <span onclick="toggleForm(true)">Login</span>
    `;
  }
}




/* =========================
   AUTH (BACKEND CONNECTED)
========================= */
async function handleAuth() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password || (!isLogin && !name)) {
    alert("Please fill all required fields");
    return;
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address (example@gmail.com)");
    return;
  }

  // Password validation
  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }


  try {
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";

    const response = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isLogin
          ? { email, password }
          : {
              name,
              email,
              password,
              college: document.getElementById("college").value,
              company: document.getElementById("company").value,
              role: document.getElementById("role").value,
              employmentType: document.getElementById("employmentType").value,
              stipend: document.getElementById("stipend").value,
              ctc: document.getElementById("ctc").value,
              city: document.getElementById("city").value
            }

      )


    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert("Signup successful! Please login.");
      toggleForm();
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* =========================
   AUTH PROTECTION (JWT)
========================= */
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function goToSalary() {
  alert("Salary Breakdown is coming soon.");
}

/* =========================
   PROFILE SAVE (BACKEND)
========================= */
async function saveProfile(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not authenticated");
    return;
  }

  const formData = new FormData(e.target);
  const profileData = {};

  formData.forEach((value, key) => {
    profileData[key] = value;
  });

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Profile save failed");
      return;
    }

    alert("Profile saved successfully!");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("form-title")) {
    toggleForm(true);
  }
});
