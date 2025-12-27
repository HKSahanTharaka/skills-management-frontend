# Skills Management System - Frontend

Modern React-based frontend for the Skills Management System.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Prerequisites

- Node.js v18.x or higher
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable components
│   ├── common/         # Generic components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── personnel/      # Personnel-specific components
│   ├── skills/         # Skills-specific components
│   ├── projects/       # Projects-specific components
│   ├── matching/       # Matching algorithm components
│   └── availability/   # Availability & allocation components
├── pages/              # Page components
│   └── auth/          # Authentication pages
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Zustand stores
├── utils/              # Utility functions
│   ├── constants.js   # Constants and enums
│   ├── helpers.js     # Helper functions
│   └── validation.js  # Zod schemas
├── App.jsx            # Main app component with routing
└── main.jsx           # Application entry point
```

## Features

### Implemented
- ✅ Authentication (Login/Register)
- ✅ Protected routes
- ✅ API service with interceptors
- ✅ Global state management
- ✅ Form validation
- ✅ Toast notifications
- ✅ Responsive layout
- ✅ TailwindCSS styling

### Coming Soon
- 🔨 Personnel management
- 🔨 Skills management
- 🔨 Projects management
- 🔨 Personnel matching algorithm
- 🔨 Availability tracking
- 🔨 Resource allocation
- 🔨 Data visualization
- 🔨 Search and filtering
- 🔨 Image upload (Cloudinary)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | - |

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends request to `/api/auth/login`
3. Backend returns JWT token and user info
4. Token is stored in localStorage
5. Token is attached to all subsequent API requests
6. Protected routes check for valid token
7. On 401 response, user is redirected to login

## API Integration

All API calls go through the centralized axios instance in `src/services/api.js`:

- Automatically attaches JWT token to requests
- Handles 401 unauthorized responses
- Redirects to login on auth failure
- Global error handling

## Styling

Uses TailwindCSS with custom configuration:

- Custom color palette (primary, secondary, success, warning, danger)
- Pre-defined component classes (.btn, .input, .card, .badge)
- Responsive design utilities
- Dark mode ready (not yet implemented)

## State Management

- **Auth State**: Zustand store (`authStore.js`)
  - User information
  - Authentication status
  - Login/logout actions

- **App State**: Zustand store (`appStore.js`)
  - UI state (sidebar, filters)
  - Global settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting
4. Test thoroughly
5. Submit a pull request

## License

ISC

