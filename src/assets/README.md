# assets/

Static files bundled by Vite.

## Structure

```
assets/
└── img/
    ├── logo-light.svg
    ├── logo-dark.svg
    └── flags/         # Language flag SVGs (i18n feature)
```

## Rules

- Only static files (SVG, PNG, fonts, icons).
- No TypeScript, no logic.
- Import directly from components: `import logo from "../assets/img/logo-light.svg"`.
