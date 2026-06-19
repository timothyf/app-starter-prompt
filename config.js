const appConfig = {
  backend: {
    languages: ["Ruby", "Python", "JavaScript (Node.js)"],
    languageVersions: {
      Ruby: ["3.2", "3.3", "3.4", "4.0"],
    },
    languageAddons: {
      Ruby: [".ruby-version file"],
    },
    frameworks: {
      Ruby: ["Ruby on Rails"],
      Python: ["Django"],
      "JavaScript (Node.js)": ["Express"],
    },
    versions: {
      "Ruby on Rails": ["7.2", "8.1"],
    },
    addons: {
      "Ruby on Rails": ["RuboCop", "Devise (for User authentication)", "DB Fixtures (seed-fu)", 
                        "Faker (for generating test data)", "Pagy (for pagination)"],
      Django: ["Ruff", "django-allauth"],
      Express: ["ESLint", "Passport.js"],
    },
    testing: {
      "Ruby on Rails": ["RSpec"],
      Django: ["Pytest"],
      Express: ["Jest"],
    },
  },
  frontend: {
    frameworks: ["React", "Vue.js"],
    addons: {
      React: ["ESLint", "Auth.js"],
      "Vue.js": ["ESLint", "Auth.js"],
    },
    testing: {
      React: ["React Testing Library"],
      "Vue.js": ["Vue Test Utils"],
    },
  },
  databases: ["Postgres", "MySQL", "SQLite"],
  databaseVersions: {
    Postgres: ["16", "17", "18"],
  },
};
