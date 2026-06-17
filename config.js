const appConfig = {
  backend: {
    languages: ["Ruby", "Python", "JavaScript (Node.js)"],
    frameworks: {
      Ruby: ["Ruby on Rails"],
      Python: ["Django"],
      "JavaScript (Node.js)": ["Express"],
    },
    addons: {
      "Ruby on Rails": ["RSpec", "RuboCop", "Devise", "DB Fixtures (seed-fu)"],
      Django: ["Pytest", "Ruff", "django-allauth"],
      Express: ["Jest", "ESLint", "Passport.js"],
    },
  },
  frontend: {
    frameworks: ["React", "Vue.js"],
    addons: {
      React: ["React Testing Library", "ESLint", "Auth.js"],
      "Vue.js": ["Vue Test Utils", "ESLint", "Auth.js"],
    },
  },
  databases: ["Postgres", "MySQL", "SQLite"],
};
