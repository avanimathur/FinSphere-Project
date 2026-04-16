const API_URL = "/api/transaction";


/* =========================
   LOAD TRANSACTIONS
========================= */
async function loadTransactions() {

  try {

    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const transactions = await res.json();

    const list = document.getElementById("transactionList");

    if (!list) return;

    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {

      const amount = Number(tx.amount);

      if (tx.type === "income")
        income += amount;
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
              ₹${amount} • ${new Date(tx.date).toLocaleDateString()}
            </p>

          </div>

        </div>

      `;

      list.appendChild(item);

    });


    /* UPDATE SUMMARY */
    const incomeEl = document.getElementById("totalIncome");
    const expenseEl = document.getElementById("totalExpense");
    const savingsEl = document.getElementById("totalSavings");

    if (incomeEl) incomeEl.innerText = "₹" + income;
    if (expenseEl) expenseEl.innerText = "₹" + expense;
    if (savingsEl) savingsEl.innerText = "₹" + (income - expense);

  }

  catch (error) {
    console.error("Error loading transactions:", error);
  }

}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* =========================
   ADD TRANSACTION
========================= */
async function addTransaction() {

  const typeEl = document.getElementById("type");
  const categoryEl = document.getElementById("category");
  const amountEl = document.getElementById("amount");
  const dateEl = document.getElementById("date");

  if (!typeEl || !categoryEl || !amountEl || !dateEl) {
    console.error("Form elements missing");
    return;
  }

  const type = typeEl.value;
  const category = categoryEl.value.trim();
  const amount = amountEl.value;
  const date = dateEl.value;

  if (!category || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  try {

    const res = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        type,
        category,
        amount,
        date
      })

    });

    if (!res.ok) {
      throw new Error("Failed to add transaction");
    }


    /* CLEAR INPUTS */
    categoryEl.value = "";
    amountEl.value = "";


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

  const confirmDelete = confirm("Are you sure you want to delete this transaction?");

  if (!confirmDelete) return;

  try {

    const res = await fetch(`${API_URL}/${id}`, {

      method: "DELETE"

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
