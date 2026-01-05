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

### Gaining Full Admin Access

To gain full access to the system, you must become an admin. After registering as a manager, run these SQL scripts on your MySQL database:

```sql
-- Approve the manager user
UPDATE users SET approval_status = 'approved' WHERE email = 'user@example.com' AND role = 'manager';

-- Promote a manager user to admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

Replace `'user@example.com'` with your actual email address.

## Additional Feature

### Availability & Allocation Management

A comprehensive resource management system that addresses one of the most critical challenges in consultancy firms: **preventing personnel burnout and optimizing team capacity planning**.

#### The Problem It Solves

In real-world consultancy environments, managers face several challenges:

1. **Over-allocation Risk**: Personnel often get assigned to multiple projects simultaneously without clear visibility of their total workload, leading to burnout and reduced quality of work.

2. **Resource Planning**: When planning new projects, managers struggle to identify who has capacity and when they'll become available.

3. **Utilization Blindness**: Without clear metrics, it's difficult to identify underutilized team members or departments, leading to inefficient resource distribution.

4. **Timeline Conflicts**: Overlapping project assignments are often discovered too late, causing delays and conflicts.

#### How It Works

The feature provides three integrated views:

**1. Availability Calendar**
- Visual calendar interface showing each personnel's availability status (available, partially allocated, fully allocated, unavailable)
- Color-coded time periods that instantly communicate capacity
- Ability to set custom availability periods (vacation, training, sick leave, etc.)
- Drag-and-drop interface for quick updates

**2. Project Allocation Timeline**
- Gantt-chart style visualization showing all team members allocated to a specific project
- 4-month rolling window with navigation controls
- Shows allocation percentages and duration for each assignment
- Visual indicators for over-allocation (>100% capacity)

**3. Team Utilization Dashboard**
- Real-time metrics showing:
  - Total personnel count
  - Optimally utilized team members (80-100%)
  - Over-allocated personnel (>100%)
  - Available capacity for new projects
- Individual utilization cards with status badges
- Breakdown of allocations per person with project details
- Warning indicators for burnout risk

#### Why This Feature Matters

Unlike simple cosmetic additions, this feature:

- **Prevents Business Risks**: Identifies over-allocation before it causes burnout or project failures
- **Enables Proactive Planning**: Managers can plan project staffing weeks or months in advance
- **Improves Decision Making**: Data-driven insights replace guesswork in resource allocation
- **Scales With Growth**: As the consultancy grows, the system maintains visibility across larger teams
- **Integrates Seamlessly**: Works with existing personnel and project data without requiring process changes

#### Technical Implementation

The feature demonstrates advanced development skills:

- **Complex State Management**: Coordinating calendar events, allocations, and real-time updates
- **Data Visualization**: Custom chart components using date-fns for timeline calculations
- **Performance Optimization**: Efficient filtering and memoization for large datasets
- **Responsive Design**: Touch-friendly calendar interface that works on all devices
- **Real-time Calculations**: Dynamic utilization percentages based on allocation data

#### User Impact

For managers, this feature transforms resource planning from a reactive, problem-solving activity into a proactive, strategic function. They can:

- Instantly see who's available for urgent projects
- Plan capacity 3-6 months ahead
- Identify and address over-allocation before it becomes a problem
- Make data-informed decisions about hiring needs
- Balance workload fairly across the team

This is the kind of feature that would be essential for any consultancy operating at scale, solving real operational challenges that directly impact both employee wellbeing and business success.
