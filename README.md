# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Code Style

This project uses ESLint and Prettier for code style enforcement. The configuration includes:

- ESLint for code quality and style checking
- Prettier for consistent code formatting
- Integration between ESLint and Prettier to avoid conflicts
- VSCode settings for automatic formatting on save

### Available Scripts

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly

### Automated Code Style Fixes

This project includes GitHub Actions workflows that automatically handle code style issues:

1. **PR Review Workflow**: Checks for code style issues in pull requests and comments if any are found.
2. **Lint and Format Workflow**: Automatically fixes code style issues in pull requests and commits the changes.
3. **Scheduled Fixes**: Runs weekly to check for and fix code style issues, creating a PR with the changes.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
