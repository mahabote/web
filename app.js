const API =
  "https://script.google.com/macros/s/AKfycbyacIPc968s2pCSwOkNYMTygN1GRPMytmzbsixCSYXJUsZvBgkIJnuD46DW9FGXvqzGDg/exec";

document.addEventListener("DOMContentLoaded", () => {

  // Initialize Materialize Select
  M.FormSelect.init(
    document.querySelectorAll("select")
  );

  loadQuestions();

  document
    .getElementById("fortuneForm")
    .addEventListener(
      "submit",
      submitForm
    );

});

/* ==========================
   LOAD QUESTIONS
========================== */

async function loadQuestions() {

  try {

    const response =
      await fetch(API);

    const questions =
      await response.json();

    const select =
      document.getElementById("question");

    select.innerHTML =
      '<option value="" disabled selected>Select Question</option>';

    questions.forEach(question => {

      const option =
        document.createElement("option");

      option.value = question;
      option.textContent = question;

      select.appendChild(option);

    });

    // Refresh Materialize Select
    M.FormSelect.init(
      document.querySelectorAll("select")
    );

  } catch (err) {

    console.error("Load Error:", err);

    document.getElementById("message").innerHTML = `
      <div class="card-panel red lighten-4 red-text text-darken-4">
        Failed to load questions.
      </div>
    `;
  }
}

/* ==========================
   SUBMIT FORM
========================== */

async function submitForm(e) {

  e.preventDefault();

  const btn =
    document.getElementById("submitBtn");

  const msg =
    document.getElementById("message");

  btn.disabled = true;

  btn.innerHTML = `
    <i class="material-icons left">hourglass_top</i>
    Submitting...
  `;

  msg.innerHTML = "";

  const data = {

    customerId:
      document
        .getElementById("customerId")
        .value
        .trim(),

    name:
      document
        .getElementById("name")
        .value
        .trim(),

    email:
      document
        .getElementById("email")
        .value
        .trim(),

    birthdate:
      document
        .getElementById("birthdate")
        .value,

    birthtime:
      document
        .getElementById("birthtime")
        .value,

    birthplace:
      document
        .getElementById("birthplace")
        .value
        .trim(),

    question:
      document
        .getElementById("question")
        .value
  };

  try {

    const params =
      new URLSearchParams({
        action: "save",
        ...data
      });

    const response =
      await fetch(
        `${API}?${params.toString()}`
      );

    const result =
      await response.json();

    console.log(result);

    if (result.success) {

      msg.innerHTML = `
        <div class="card-panel green lighten-4 green-text text-darken-4">
          <strong>Success!</strong><br>
          ${result.message}
        </div>
      `;

      document
        .getElementById("fortuneForm")
        .reset();

      // Reset Materialize fields
      M.updateTextFields();

      M.FormSelect.init(
        document.querySelectorAll("select")
      );

      M.toast({
        html: "Registration submitted successfully!",
        classes: "green"
      });

    } else {

      msg.innerHTML = `
        <div class="card-panel red lighten-4 red-text text-darken-4">
          ${result.message}
        </div>
      `;
    }

  } catch (err) {

    console.error(err);

    msg.innerHTML = `
      <div class="card-panel red lighten-4 red-text text-darken-4">
        ${err.toString()}
      </div>
    `;
  }

  btn.disabled = false;

  btn.innerHTML = `
    <i class="material-icons left">send</i>
    Book Now
  `;
}
