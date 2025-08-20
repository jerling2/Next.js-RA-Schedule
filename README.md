# Next.js-RA-Schedule

A full-stack scheduling application for managing Resident Assistant (RA) shifts, built with Next.js and Firebase. The project provides user authentication, protected dashboards, and interactive preference entry for scheduling.

## Features

- **Authentication & Authorization**
  - User registration, email verification, and sign-in with Firebase Auth.
  - Secure JWT-based session management with cloud function JWT decoding.
  - Role-based access: separate dashboards for users and admins.

- **Interactive Scheduling Interface**
  - Users can enter and adjust shift preferences by week and by day.
  - Intuitive drag-and-drop and copy-paste interactions for priority management.
  - Real-time feedback and validation for input fields.

- **Protected Routes**
  - Middleware-based route protection for `/dashboard` and `/admin` routes.
  - Automatic redirection based on authentication state and user roles.

- **Modern UI/UX**
  - Built with React 19, Next.js App Router, and Tailwind CSS for a responsive, accessible interface.
  - Custom reusable UI components: accordions, pop-up menus, stylized inputs, and contextual feedback.

- **Developer Experience**
  - Monorepo structure with separate packages for web, functions, and shared code.
  - TypeScript throughout for type safety.
  - Modular features for easy extension and maintenance.
  - Emulators and environment variable support for local development.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, TypeScript
- **Backend/Serverless:** Firebase Functions (Node.js 18), Firebase Admin SDK, JWT
- **Authentication:** Firebase Auth (with support for emulators)
- **State Management:** React Context API
- **Build Tooling:** Babel, ESLint, Turbopack, Yarn Workspaces

## Project Structure

```
/
├── packages/
│   ├── web/          # Next.js app router, UI, features, and utils
│   ├── functions/    # Firebase Cloud Functions (admin, JWT decode, claims)
│   └── shared/       # Shared code (for future use)
├── firebase.json     # Firebase deployment config
├── .firebaserc       # Firebase project alias
├── package.json      # Yarn workspaces config
└── README.md
```

### Key Folders

- `packages/web/src/app` – Next.js App Router pages and layouts
- `packages/web/src/features` – Modular features: `auth`, `dashboard`, `priority`, `ui`
- `packages/functions/src` – Firebase serverless functions (JWT decode, custom claims)
- `packages/web/src/utils` – Shared utility code (client/server helpers, middleware)

## Usage

- Visit `/welcome` to create an account or sign in.
- Authenticated users are directed to `/dashboard` to manage their shift preferences.
- Admin users are directed to `/admin/dashboard`.
- All routes are protected via middleware and Firebase JWTs.

## License

MIT License. See [LICENSE](../LICENSE) for details.

---

**Maintained by [jerling2](https://github.com/jerling2)**
