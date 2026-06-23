# The Bean Chronicles (TBC) - Development Guide

Welcome to the development guide for **The Bean Chronicles (TBC)**. Follow these guidelines to maintain consistency across the codebase.

## 🛠️ Quick Commands

### Development & Build

- **Start dev server:** `npm run dev` or `vite` (depending on setup)
- **Build project:** `npm run build`
- **Preview build:** `npm run preview`
- **Lint code:** `npm run lint`

### 🪵 Future Firebase Commands (Pre-requisites)

- **Firebase login:** `npx firebase login`
- **Firebase init:** `npx firebase init`
- **Deploy to Firebase:** `npx firebase deploy`

---

## 🎨 Code Guidelines

### React & TypeScript Architecture

- **Components:** Use functional components with explicit TypeScript interfaces/types for props.
- **File Structure:** Use PascalCase for component files (e.g., `CoffeeCard.tsx`) and camelCase for hooks/utilities (e.g., `useCoffeeBrew.ts`).
- **State Management:** Use standard React hooks (`useState`, `useContext`, `useReducer`) for local/global state. Keep state as local as possible.
- **Styling:** Maintain modular styles (Tailwind CSS classes preferred, or CSS Modules).

### ⚡ Future Firebase Integration

- Keep all Firebase configuration isolated inside a `src/config/firebase.ts` file.
- Use custom React hooks (e.g., `useAuth`, `useFirestore`) to abstract Firebase service calls away from the UI components.

### Git & Commit Guidelines

- **Branching:** Use descriptive branch names like `feature/brew-tracker` or `bugfix/nav-issue`.
- **Commit Messages:** Follow standard conventional commits:
  - `feat: add phin filter brewing guide`
  - `fix: resolve moka pot routing error`
  - `docs: update deployment instructions`

---

## 🚀 Commit & Deployment Flow

### 1. Commit Strategy

Ensure your local workspace is clean and linted before pushing:

```bash
npm run lint
git add .
git commit -m "feat: your descriptive commit message"
```
