const stackOptions = {
  backend: {
    Ruby: {
      framework: "Ruby on Rails",
      addons: ["RSpec", "Devise"],
    },
    Python: {
      framework: "Django",
      addons: ["Pytest", "django-allauth"],
    },
  },
  frontend: {
    React: ["React Testing Library", "Auth.js"],
    "Vue.js": ["Vue Test Utils", "Auth.js"],
  },
};

const form = document.querySelector("#stack-form");
const backendLanguageSelect = document.querySelector("#backend-language");
const backendFrameworkSelect = document.querySelector("#backend-framework");
const frontendFrameworkSelect = document.querySelector("#frontend-framework");
const backendAddonsContainer = document.querySelector("#backend-addons");
const frontendAddonsContainer = document.querySelector("#frontend-addons");
const promptOutput = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-button");
const copyStatus = document.querySelector("#copy-status");

function renderCheckboxes(container, name, values) {
  container.innerHTML = "";

  values.forEach((value) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = value;
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.append(` ${value}`);
    container.appendChild(label);
  });
}

function updateBackendOptions() {
  const selectedLanguage = backendLanguageSelect.value;
  const backendConfig = stackOptions.backend[selectedLanguage];

  backendFrameworkSelect.innerHTML = '<option value="">Select a backend framework</option>';

  if (!backendConfig) {
    backendFrameworkSelect.disabled = true;
    renderCheckboxes(backendAddonsContainer, "backend-addon", []);
    return;
  }

  const option = document.createElement("option");
  option.value = backendConfig.framework;
  option.textContent = backendConfig.framework;
  option.selected = true;

  backendFrameworkSelect.appendChild(option);
  backendFrameworkSelect.disabled = false;
  renderCheckboxes(backendAddonsContainer, "backend-addon", backendConfig.addons);
}

function updateFrontendOptions() {
  const selectedFramework = frontendFrameworkSelect.value;
  const frontendAddons = stackOptions.frontend[selectedFramework] || [];

  renderCheckboxes(frontendAddonsContainer, "frontend-addon", frontendAddons);
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (input) => input.value,
  );
}

function getSelectedDatabase() {
  const selectedDatabase = document.querySelector('input[name="database"]:checked');
  return selectedDatabase ? selectedDatabase.value : "";
}

function buildPrompt() {
  const backendLanguage = backendLanguageSelect.value;
  const backendFramework = backendFrameworkSelect.value;
  const database = getSelectedDatabase();
  const frontendFramework = frontendFrameworkSelect.value;
  const backendAddons = getCheckedValues("backend-addon");
  const frontendAddons = getCheckedValues("frontend-addon");

  if (!backendLanguage || !backendFramework || !frontendFramework) {
    return "";
  }

  return [
    "Build a production-ready web application using the following technology stack:",
    "",
    "Frontend:",
    `- Framework: ${frontendFramework}`,
    `- Add-ons: ${frontendAddons.length ? frontendAddons.join(", ") : "None selected"}`,
    "",
    "Backend:",
    `- Language: ${backendLanguage}`,
    `- Framework: ${backendFramework}`,
    `- Database: ${database}`,
    `- Add-ons: ${backendAddons.length ? backendAddons.join(", ") : "None selected"}`,
    "",
    "Please include:",
    "- A clear project structure for the selected stack.",
    "- User login and authentication using the selected add-ons where applicable.",
    "- Automated test coverage using the selected testing tools.",
    "- Setup instructions for running the frontend and backend locally.",
  ].join("\n");
}

function fallbackCopy(text) {
  if (!document.body || typeof document.execCommand !== "function") {
    return false;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";

  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(helper);

  return copied;
}

async function copyPrompt() {
  if (!promptOutput.textContent || promptOutput.textContent === "Select your stack and generate a prompt.") {
    return;
  }

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(promptOutput.textContent);
      copyStatus.textContent = "Prompt copied to clipboard.";
      return;
    }
  } catch (error) {
    // Fall through to the legacy copy approach below.
  }

  copyStatus.textContent = fallbackCopy(promptOutput.textContent)
    ? "Prompt copied to clipboard."
    : "Unable to copy the prompt automatically.";
}

backendLanguageSelect.addEventListener("change", () => {
  updateBackendOptions();
  copyStatus.textContent = "";
});

frontendFrameworkSelect.addEventListener("change", () => {
  updateFrontendOptions();
  copyStatus.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const prompt = buildPrompt();

  if (!prompt) {
    promptOutput.textContent = "Please select a backend language, backend framework, and frontend framework.";
    copyButton.disabled = true;
    return;
  }

  promptOutput.textContent = prompt;
  copyButton.disabled = false;
  copyStatus.textContent = "";
});

copyButton.addEventListener("click", copyPrompt);

updateBackendOptions();
updateFrontendOptions();
