const API_URL = "/api/transaction";


/* =========================
   LOAD TRANSACTIONS
   + Auto-load profile income from stipend/ctc
========================= */
async function loadTransactions() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {

    // FIX: fetch profile to get stipend/ctc as base income
    let profileIncome = 0;
    try {
      const profileRes = await fetch("/api/profile", {
        headers: { "Authorization": "Bearer " + token }
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        // Use stipend if intern, CTC/12 if full-time, whichever is filled
        if (profile.stipend && Number(profile.stipend) > 0) {
          profileIncome = Number(profile.stipend);
        } else if (profile.ctc && Number(profile.ctc) > 0) {
          profileIncome = Math.round(Number(profile.ctc) / 12);
        }
      }
    } catch (e) {
      console.warn("Could not load profile income:", e);
    }

    // FIX: send auth token so only this user's transactions are returned
    const res = await fetch(API_URL, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const transactions = await res.json();

    const list = document.getElementById("transactionList");

    if (!list) return;

    list.innerHTML = "";

    let txIncome = 0;
    let expense = 0;

    transactions.forEach(tx => {

      const amount = Number(tx.amount);

      if (tx.type === "income")
        txIncome += amount;
      else
        expense += amount;

      const item = document.createElement("div");

      item.className = "feature-card transaction-item";

      item.innerHTML = `

        <div class="transaction-left">

          <button class="delete-icon"
            onclick="deleteTransaction('${tx._id}')"
            title="Delete Transaction">
            🗑
          </button>

          <div>

            <h3>
              ${tx.type === "income" ? "💰" : "💸"} ${tx.category}
            </h3>

            <p>
              ₹${amount.toLocaleString("en-IN")} • ${new Date(tx.date).toLocaleDateString()}
            </p>

          </div>

        </div>

      `;

      list.appendChild(item);

    });


    /* UPDATE SUMMARY
       FIX: total income = profile base income (stipend/ctc) + manually added income transactions */
    const totalIncome = profileIncome + txIncome;
    const incomeEl  = document.getElementById("totalIncome");
    const expenseEl = document.getElementById("totalExpense");
    const savingsEl = document.getElementById("totalSavings");

    if (incomeEl)  incomeEl.innerText  = "₹" + totalIncome.toLocaleString("en-IN");
    if (expenseEl) expenseEl.innerText = "₹" + expense.toLocaleString("en-IN");
    if (savingsEl) savingsEl.innerText = "₹" + (totalIncome - expense).toLocaleString("en-IN");

    // Show a note if profile income is being used
    const profileIncomeNote = document.getElementById("profileIncomeNote");
    if (profileIncomeNote) {
      if (profileIncome > 0) {
        profileIncomeNote.innerText = `ℹ️ Base income of ₹${profileIncome.toLocaleString("en-IN")}/month entered in your profile.`;
        profileIncomeNote.style.display = "block";
      } else {
        profileIncomeNote.innerText = "ℹ️ No stipend/CTC set in your profile. Update your profile to auto-fill income.";
        profileIncomeNote.style.display = "block";
      }
    }

  }

  catch (error) {
    console.error("Error loading transactions:", error);
  }

}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   ADD TRANSACTION
========================= */
async function addTransaction() {

  const token = localStorage.getItem("token");
  if (!token) { window.location.href = "index.html"; return; }

  const typeEl     = document.getElementById("type");
  const categoryEl = document.getElementById("category");
  const amountEl   = document.getElementById("amount");
  const dateEl     = document.getElementById("date");

  if (!typeEl || !categoryEl || !amountEl || !dateEl) {
    console.error("Form elements missing");
    return;
  }

  const type     = typeEl.value;
  const category = categoryEl.value.trim();
  const amount   = amountEl.value;
  const date     = dateEl.value;

  if (!category || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  try {

    // FIX: send auth token so transaction is saved against this user
    const res = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token   // FIX: was missing!
      },

      body: JSON.stringify({ type, category, amount, date })

    });

    if (!res.ok) {
      throw new Error("Failed to add transaction");
    }


    /* CLEAR INPUTS */
    categoryEl.value = "";
    amountEl.value   = "";


    /* RESET DATE TO TODAY */
    const today = new Date().toISOString().split("T")[0];
    dateEl.value = today;


    /* RELOAD LIST */
    loadTransactions();

  }

  catch (error) {
    console.error("Add failed:", error);
    alert("Failed to add transaction");
  }

}



/* =========================
   DELETE TRANSACTION
========================= */
async function deleteTransaction(id) {

  const token = localStorage.getItem("token");
  if (!token) { window.location.href = "index.html"; return; }

  const confirmDelete = confirm("Are you sure you want to delete this transaction?");

  if (!confirmDelete) return;

  try {

    // FIX: send auth token
    const res = await fetch(`${API_URL}/${id}`, {

      method: "DELETE",

      headers: { "Authorization": "Bearer " + token }   // FIX: was missing!

    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    loadTransactions();

  }

  catch (error) {

    console.error("Delete failed:", error);
    alert("Failed to delete transaction");

  }

}



/* =========================
   AUTO-FILL TODAY'S DATE
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const dateInput = document.getElementById("date");

  if (dateInput) {

    const today = new Date().toISOString().split("T")[0];

    dateInput.value = today;

  }

});
