const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* LOAD PROFILE */
async function loadProfile() {
  const res = await fetch("/api/profile", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (!res.ok) {
    console.log("Failed to load profile");
    return;
  }

  const data = await res.json();

  if (!data) return;

  document.getElementById("fullName").value = data.name || "";
  document.getElementById("college").value = data.college || "";
  document.getElementById("company").value = data.company || "";
  document.getElementById("role").value = data.role || "";
  document.getElementById("employmentType").value = data.employmentType || "";
  document.getElementById("stipend").value = data.stipend || "";
  document.getElementById("ctc").value = data.ctc || "";
  document.getElementById("city").value = data.city || "";
}

loadProfile();

/* SAVE / UPDATE */
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    name: fullName.value,
    college: college.value,
    company: company.value,
    role: role.value,
    employmentType: employmentType.value,
    stipend: parseFloat(stipend.value) || 0,   // FIX: send as number, not string
    ctc:     parseFloat(ctc.value)     || 0,   // FIX: send as number, not string
    city: city.value
  };

  await fetch("/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  alert("Profile saved successfully!");
});

/* DELETE PROFILE */
async function deleteProfile() {
  if (!confirm("Are you sure you want to delete your profile?")) return;

  await fetch("/api/profile", {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  alert("Profile deleted");
  window.location.reload();
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
