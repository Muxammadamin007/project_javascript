const form = document.getElementById("regForm");
const idInput = document.getElementById("studentId");
const nameInput = document.getElementById("fullName");
const trackInput = document.getElementById("track");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const termsInput = document.getElementById("agreeTerms");
const formContainer = document.getElementById("formContainer");
const successCard = document.getElementById("successCard");
const summaryDetails = document.getElementById("summaryDetails");
const touchedFields = new Set();

function markValid(input, errorId) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.setAttribute("aria-invalid", "false");
  document.getElementById(errorId).textContent = "";
  return true;
}

function markInvalid(input, errorId, message) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  document.getElementById(errorId).textContent = message;
  return false;
}

function checkId() {
  const value = idInput.value.trim();
  if (!value) return markInvalid(idInput, "idError", "Enter your campus ID.");
  if (!/^\\d{9}$/.test(value)) return markInvalid(idInput, "idError", "Your campus ID must be exactly 9 digits.");
  return markValid(idInput, "idError");
}

function checkName() {
  const value = nameInput.value.trim();
  if (!value) return markInvalid(nameInput, "nameError", "Tell us your name.");
  if (value.length < 2) return markInvalid(nameInput, "nameError", "Your name must be at least 2 characters.");
  return markValid(nameInput, "nameError");
}

function checkTrack() {
  if (!trackInput.value) return markInvalid(trackInput, "trackError", "Choose the lab track you’re interested in.");
  return markValid(trackInput, "trackError");
}

function checkEmail() {
  const value = emailInput.value.trim();
  if (!value) return markInvalid(emailInput, "emailError", "Enter your email address.");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) return markInvalid(emailInput, "emailError", "Enter a valid email address, like you@example.edu.");
  return markValid(emailInput, "emailError");
}

function checkPassword() {
  if (!passwordInput.value) return markInvalid(passwordInput, "passwordError", "Create a password to continue.");
  if (passwordInput.value.length < 8) return markInvalid(passwordInput, "passwordError", "Use at least 8 characters for your password.");
  markValid(passwordInput, "passwordError");
  if (touchedFields.has(confirmInput)) checkConfirm();
  return true;
}

function checkConfirm() {
  if (!confirmInput.value) return markInvalid(confirmInput, "confirmError", "Type your password one more time.");
  if (confirmInput.value !== passwordInput.value) return markInvalid(confirmInput, "confirmError", "These passwords don’t match yet.");
  return markValid(confirmInput, "confirmError");
}

function checkTerms() {
  const error = document.getElementById("termsError");
  if (!termsInput.checked) {
    termsInput.setAttribute("aria-invalid", "true");
    error.textContent = "Please agree to the participation guidelines to register.";
    return false;
  }
  termsInput.setAttribute("aria-invalid", "false");
  error.textContent = "";
  return true;
}

const fieldChecks = new Map([
  [idInput, checkId],
  [nameInput, checkName],
  [trackInput, checkTrack],
  [emailInput, checkEmail],
  [passwordInput, checkPassword],
  [confirmInput, checkConfirm]
]);

for (const [input, check] of fieldChecks) {
  input.addEventListener("blur", () => {
    touchedFields.add(input);
    check();
  });
  input.addEventListener(input === trackInput ? "change" : "input", () => {
    if (touchedFields.has(input)) check();
  });
}
termsInput.addEventListener("change", checkTerms);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  for (const input of fieldChecks.keys()) touchedFields.add(input);

  const checks = [...fieldChecks.values()].map((check) => check());
  const termsValid = checkTerms();
  if (!checks.every(Boolean) || !termsValid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const details = [
    ["Campus ID", idInput.value.trim()],
    ["Name", nameInput.value.trim()],
    ["Lab track", trackInput.value],
    ["Email", emailInput.value.trim()]
  ];

  summaryDetails.replaceChildren(...details.map(([label, value]) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    row.append(term, description);
    return row;
  }));

  formContainer.hidden = true;
  successCard.hidden = false;
  successCard.focus();
});

document.getElementById("resetButton").addEventListener("click", () => {
  form.reset();
  touchedFields.clear();

  for (const input of [...fieldChecks.keys(), termsInput]) {
    input.classList.remove("is-valid", "is-invalid");
    input.setAttribute("aria-invalid", "false");
  }

  for (const error of form.querySelectorAll(".error-msg")) error.textContent = "";
  summaryDetails.replaceChildren();
  successCard.hidden = true;
  formContainer.hidden = false;
  idInput.focus();
});
