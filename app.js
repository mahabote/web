const API =
  "https://script.google.com/macros/s/AKfycbyacIPc968s2pCSwOkNYMTygN1GRPMytmzbsixCSYXJUsZvBgkIJnuD46DW9FGXvqzGDg/exec";

document.addEventListener("DOMContentLoaded", () => {

  loadQuestions();

  const form = document.getElementById("fortuneForm");

  if (form) {
    form.addEventListener("submit", submitForm);
  }

});

/* =========================
   Load Dropdown Questions
========================= */

async function loadQuestions() {

  try {

    const response = await fetch(API);

    const questions = await response.json();

    console.log("Questions:", questions);

    const select =
      document.getElementById("question");

    if (!select) return;

    select.innerHTML =
      '<option value="">Select Question</option>';

    questions.forEach(question => {

      const option =
        document.createElement("option");

      option.value = question;
      option.textContent = question;

      select.appendChild(option);

    });

  } catch (err) {

    console.error("LOAD ERROR:", err);

    const msg =
      document.getElementById("message");

    if (msg) {
      msg.innerHTML =
        `<div class="error">
          Failed to load questions.
        </div>`;
    }
  }
}

/* =========================
   Submit Form
========================= */

async function submitForm(e) {

  e.preventDefault();

  const btn =
    document.getElementById("submitBtn");

  const msg =
    document.getElementById("message");

  btn.disabled = true;
  btn.textContent = "Submitting...";

  msg.innerHTML = "";

  const data = {

    customerId:
      document.getElementById("customerId").value.trim(),

    name:
      document.getElementById("name").value.trim(),

    email:
      document.getElementById("email").value.trim(),

    birthdate:
      document.getElementById("birthdate").value,

    birthtime:
      document.getElementById("birthtime").value,

    birthplace:
      document.getElementById("birthplace").value.trim(),

    question:
      document.getElementById("question").value

  };

  try {

    const params =
      new URLSearchParams({
        action: "save",
        ...data
      });

    const requestUrl =
      `${API}?${params.toString()}`;

    console.log("REQUEST URL:");
    console.log(requestUrl);

    const response =
      await fetch(requestUrl);

    const text =
      await response.text();

    console.log("SERVER RESPONSE:");
    console.log(text);

    let result;

    try {

      result = JSON.parse(text);

    } catch (jsonError) {

      console.error("JSON PARSE ERROR:", jsonError);

      msg.innerHTML =
        `<div class="error">
          Invalid response from server.
        </div>`;

      return;
    }

    if (result.success) {

      msg.innerHTML =
        `<div class="success">
          ${result.message}
        </div>`;

      document
        .getElementById("fortuneForm")
        .reset();

    } else {

      msg.innerHTML =
        `<div class="error">
          ${result.message || "Unknown server error"}
        </div>`;
    }

  } catch (err) {

    console.error("SUBMIT ERROR:", err);

    msg.innerHTML =
      `<div class="error">
        ${err.toString()}
      </div>`;
  }

  btn.disabled = false;
  btn.textContent = "Book Now";
}
