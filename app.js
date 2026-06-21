const API =
  "https://script.google.com/macros/s/AKfycbyacIPc968s2pCSwOkNYMTygN1GRPMytmzbsixCSYXJUsZvBgkIJnuD46DW9FGXvqzGDg/exec";

document.addEventListener("DOMContentLoaded", () => {

  M.AutoInit();

  loadQuestions();

  document
    .getElementById("fortuneForm")
    .addEventListener(
      "submit",
      submitForm
    );

});

/* =====================================
   LOAD QUESTIONS
===================================== */

async function loadQuestions() {

  try {

    const response =
      await fetch(API);

    const questions =
      await response.json();

    const select =
      document.getElementById(
        "question"
      );

    select.innerHTML =
      '<option value="" disabled selected>Select Question</option>';

    questions.forEach(question => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        question;

      option.textContent =
        question;

      select.appendChild(
        option
      );

    });

    M.FormSelect.init(
      document.querySelectorAll(
        "select"
      )
    );

  } catch (err) {

    console.error(err);

    M.toast({
      html:
        "Unable to load questions",
      classes:
        "red"
    });
  }
}

/* =====================================
   FILE TO BASE64
===================================== */

function fileToBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            reader.result
          );

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );

    }
  );
}

/* =====================================
   SUBMIT FORM
===================================== */

async function submitForm(e) {

  e.preventDefault();

  const btn =
    document.getElementById(
      "submitBtn"
    );

  const msg =
    document.getElementById(
      "message"
    );

  btn.disabled = true;

  btn.innerHTML =
    "Submitting...";

  msg.innerHTML = "";

  try {

    const imageFile =
      document
        .getElementById(
          "image"
        )
        ?.files[0];

    let imageData = "";

    /* ==========================
       IMAGE VALIDATION
    ========================== */

    if (imageFile) {

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      const maxSize =
        1.5 * 1024 * 1024;

      if (
        !allowedTypes.includes(
          imageFile.type
        )
      ) {

        throw new Error(
          "Only JPG, PNG and WEBP images are allowed."
        );
      }

      if (
        imageFile.size >
        maxSize
      ) {

        throw new Error(
          "Image must be less than 1.5 MB."
        );
      }

      imageData =
        await fileToBase64(
          imageFile
        );
    }

    /* ==========================
       FORM DATA
    ========================== */

    const data = {

      customerId:
        document
          .getElementById(
            "customerId"
          )
          .value
          .trim(),

      name:
        document
          .getElementById(
            "name"
          )
          .value
          .trim(),

      email:
        document
          .getElementById(
            "email"
          )
          .value
          .trim(),

      birthdate:
        document
          .getElementById(
            "birthdate"
          )
          .value,

      birthtime:
        document
          .getElementById(
            "birthtime"
          )
          .value,

      birthplace:
        document
          .getElementById(
            "birthplace"
          )
          .value
          .trim(),

      question:
        document
          .getElementById(
            "question"
          )
          .value,

      imageData:
        imageData
    };

    /* ==========================
       SEND TO APPS SCRIPT
    ========================== */

    const response =
      await fetch(
        API,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain"
          },

          body:
            JSON.stringify(
              data
            )
        }
      );

    const result =
      await response.json();

    console.log(result);

    if (
      result.success
    ) {

      msg.innerHTML = `
        <div class="card-panel green lighten-4 green-text text-darken-4">
          ${result.message}
        </div>
      `;

      M.toast({
        html:
          "Registration submitted successfully",
        classes:
          "green"
      });

      document
        .getElementById(
          "fortuneForm"
        )
        .reset();

      M.updateTextFields();

      M.FormSelect.init(
        document.querySelectorAll(
          "select"
        )
      );

    } else {

      throw new Error(
        result.message
      );
    }

  } catch (err) {

    console.error(
      err
    );

    msg.innerHTML = `
      <div class="card-panel red lighten-4 red-text text-darken-4">
        ${err.message}
      </div>
    `;

    M.toast({
      html:
        err.message,
      classes:
        "red"
    });
  }

  btn.disabled = false;

  btn.innerHTML =
    "BOOK NOW";
}
