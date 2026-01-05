# Skills Management System

A web app for managing team members, their skills, and project assignments. Helps match the right people to projects based on their skills and availability.

## Tech Stack

- React 18 + Vite
- React Router for navigation
- Zustand for state management
- TanStack Query for data fetching
- Tailwind CSS for styling
- React Hook Form + Zod for forms/validation
- Axios for API calls
- Playwright for E2E testing

## Prerequisites

You'll need these installed:

- **Node.js** - version 18 or higher
- **MySQL** - version 8.0 or higher (for the backend)

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

3. Start the dev server:

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Other Commands

```bash
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run test:e2e     # Run E2E tests
```

## Backend Setup

Make sure the backend API is running on port 5000 (or update `VITE_API_BASE_URL` in your `.env` file).

The backend needs MySQL running and properly configured. Check the backend repo for database setup instructions.
