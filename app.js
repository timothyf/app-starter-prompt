const form = document.querySelector("#stack-form");
const appDescriptionInput = document.querySelector("#app-description");
const backendLanguageSelect = document.querySelector("#backend-language");
const backendLanguageVersionGroup = document.querySelector("#backend-language-version-group");
const backendLanguageVersionLabel = document.querySelector("#backend-language-version-label");
const backendLanguageVersionSelect = document.querySelector("#backend-language-version");
const backendFrameworkSelect = document.querySelector("#backend-framework");
const backendVersionGroup = document.querySelector("#backend-version-group");
const backendVersionLabel = document.querySelector("#backend-version-label");
const backendVersionSelect = document.querySelector("#backend-version");
const frontendFrameworkSelect = document.querySelector("#frontend-framework");
const databaseSelect = document.querySelector("#database");
const databaseVersionGroup = document.querySelector("#database-version-group");
const databaseVersionLabel = document.querySelector("#database-version-label");
const databaseVersionSelect = document.querySelector("#database-version");
const backendAddonsContainer = document.querySelector("#backend-addons");
const frontendAddonsContainer = document.querySelector("#frontend-addons");
const promptOutput = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-button");
const copyStatus = document.querySelector("#copy-status");

function createOption(value, text = value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;

  return option;
}

function renderSelectOptions(select, values) {
  values.forEach((value) => {
    select.appendChild(createOption(value));
  });
}

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
  const backendFrameworks = appConfig.backend.frameworks[selectedLanguage] || [];

  backendFrameworkSelect.innerHTML = '<option value="">Select a backend framework</option>';

  if (!backendFrameworks.length) {
    backendFrameworkSelect.disabled = true;
    updateBackendVersions();
    renderCheckboxes(backendAddonsContainer, "backend-addon", []);
    return;
  }

  backendFrameworks.forEach((framework, index) => {
    const option = createOption(framework);
    option.selected = index === 0;

    backendFrameworkSelect.appendChild(option);
  });
  backendFrameworkSelect.disabled = false;
  updateBackendVersions();
  updateBackendAddons();
}

function updateBackendLanguageVersions() {
  const selectedLanguage = backendLanguageSelect.value;
  const versions = (appConfig.backend.languageVersions || {})[selectedLanguage] || [];

  backendLanguageVersionSelect.innerHTML = '<option value="">Select a version</option>';

  if (!versions.length) {
    backendLanguageVersionGroup.hidden = true;
    backendLanguageVersionSelect.disabled = true;
    backendLanguageVersionLabel.textContent = "Language Version";
    return;
  }

  versions.forEach((version, index) => {
    const option = createOption(version);
    option.selected = index === versions.length - 1;

    backendLanguageVersionSelect.appendChild(option);
  });
  backendLanguageVersionLabel.textContent = `${selectedLanguage} Version`;
  backendLanguageVersionGroup.hidden = false;
  backendLanguageVersionSelect.disabled = false;
}

function updateBackendVersions() {
  const selectedFramework = backendFrameworkSelect.value;
  const versions = (appConfig.backend.versions || {})[selectedFramework] || [];

  backendVersionSelect.innerHTML = '<option value="">Select a version</option>';

  if (!versions.length) {
    backendVersionGroup.hidden = true;
    backendVersionSelect.disabled = true;
    backendVersionLabel.textContent = "Framework Version";
    return;
  }

  versions.forEach((version, index) => {
    const option = createOption(version);
    option.selected = index === versions.length - 1;

    backendVersionSelect.appendChild(option);
  });
  backendVersionLabel.textContent = `${selectedFramework} Version`;
  backendVersionGroup.hidden = false;
  backendVersionSelect.disabled = false;
}

function updateBackendAddons() {
  const selectedLanguage = backendLanguageSelect.value;
  const selectedFramework = backendFrameworkSelect.value;
  const languageAddons = (appConfig.backend.languageAddons || {})[selectedLanguage] || [];
  const frameworkAddons = appConfig.backend.addons[selectedFramework] || [];
  const backendAddons = [...languageAddons, ...frameworkAddons];

  renderCheckboxes(backendAddonsContainer, "backend-addon", backendAddons);
}

function updateFrontendOptions() {
  const selectedFramework = frontendFrameworkSelect.value;
  const frontendAddons = appConfig.frontend.addons[selectedFramework] || [];

  renderCheckboxes(frontendAddonsContainer, "frontend-addon", frontendAddons);
}

function initializeFormOptions() {
  renderSelectOptions(backendLanguageSelect, appConfig.backend.languages);
  renderSelectOptions(frontendFrameworkSelect, appConfig.frontend.frameworks);
  renderSelectOptions(databaseSelect, appConfig.databases);
  databaseSelect.value = "";
  updateDatabaseVersions();
  updateBackendLanguageVersions();
  updateBackendOptions();
  updateFrontendOptions();
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (input) => input.value,
  );
}

function getSelectedDatabase() {
  return databaseSelect.value;
}

function updateDatabaseVersions() {
  const selectedDatabase = getSelectedDatabase();
  const versions = (appConfig.databaseVersions || {})[selectedDatabase] || [];

  databaseVersionSelect.innerHTML = '<option value="">Select a version</option>';

  if (!versions.length) {
    databaseVersionGroup.hidden = true;
    databaseVersionSelect.disabled = true;
    databaseVersionLabel.textContent = "Database Version";
    return;
  }

  versions.forEach((version, index) => {
    const option = createOption(version);
    option.selected = index === versions.length - 1;

    databaseVersionSelect.appendChild(option);
  });
  databaseVersionLabel.textContent = `${selectedDatabase} Version`;
  databaseVersionGroup.hidden = false;
  databaseVersionSelect.disabled = false;
}

function buildPrompt() {
  const appDescription = appDescriptionInput.value.trim();
  const backendLanguage = backendLanguageSelect.value;
  const backendLanguageVersion = backendLanguageVersionGroup.hidden ? "" : backendLanguageVersionSelect.value;
  const backendFramework = backendFrameworkSelect.value;
  const backendVersion = backendVersionGroup.hidden ? "" : backendVersionSelect.value;
  const database = getSelectedDatabase();
  const databaseVersion = databaseVersionGroup.hidden ? "" : databaseVersionSelect.value;
  const frontendFramework = frontendFrameworkSelect.value;
  const backendAddons = getCheckedValues("backend-addon");
  const frontendAddons = getCheckedValues("frontend-addon");

  if (!backendLanguage || !backendFramework) {
    return "";
  }

  const promptLines = [
    "Build a production-ready web application using the following technology stack:",
  ];

  if (appDescription) {
    promptLines.push("", "App Description:", appDescription);
  }

  promptLines.push(
    "",
    "Backend:",
    `- Language: ${backendLanguageVersion ? `${backendLanguage} ${backendLanguageVersion}` : backendLanguage}`,
    `- Framework: ${backendVersion ? `${backendFramework} ${backendVersion}` : backendFramework}`,
  );

  if (database) {
    promptLines.push(`- Database: ${databaseVersion ? `${database} ${databaseVersion}` : database}`);
  }

  promptLines.push(`- Add-ons: ${backendAddons.length ? backendAddons.join(", ") : "None selected"}`);

  if (frontendFramework) {
    promptLines.push(
      "",
      "Frontend:",
      `- Framework: ${frontendFramework}`,
      `- Add-ons: ${frontendAddons.length ? frontendAddons.join(", ") : "None selected"}`,
    );
  } else {
    promptLines.push("", "Frontend: None selected. Build a backend-only application.");
  }

  promptLines.push(
    "",
    "Please include:",
    "- A clear project structure for the selected stack.",
    "- User login and authentication using the selected add-ons where applicable.",
    "- Automated test coverage using the selected testing tools.",
    frontendFramework
      ? "- Setup instructions for running the frontend and backend locally."
      : "- Setup instructions for running the backend locally.",
  );

  return promptLines.join("\n");
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
  updateBackendLanguageVersions();
  updateBackendOptions();
  copyStatus.textContent = "";
});

backendLanguageVersionSelect.addEventListener("change", () => {
  copyStatus.textContent = "";
});

backendFrameworkSelect.addEventListener("change", () => {
  updateBackendVersions();
  updateBackendAddons();
  copyStatus.textContent = "";
});

backendVersionSelect.addEventListener("change", () => {
  copyStatus.textContent = "";
});

databaseVersionSelect.addEventListener("change", () => {
  copyStatus.textContent = "";
});

databaseSelect.addEventListener("change", () => {
  updateDatabaseVersions();
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
    promptOutput.textContent = "Please select a backend language and backend framework.";
    copyButton.disabled = true;
    return;
  }

  promptOutput.textContent = prompt;
  copyButton.disabled = false;
  copyStatus.textContent = "";
});

copyButton.addEventListener("click", copyPrompt);

initializeFormOptions();
