# Genmedi - Generic Medicine Delivery Platform

A complete e-pharmacy platform for affordable generic medicines with 45-minute delivery in India.

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│  (Source Code)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌──▼─────────┐
│ Vercel │ │  Render    │
│(Frontend)│ │ (Backend) │
└───┬────┘ └──┬─────────┘
    │         │
    │    ┌────▼────┐
    │    │ MongoDB │
    │    │  Atlas  │
    │    └─────────┘
    │
    └──► User
```

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Express.js + Node.js)
- **Database**: MongoDB Atlas
- **Repository**: GitHub

## Project Structure

```
genmedi/
├── frontend/                 # React + Vite application (deploy to Vercel)
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── data/            # Mock data
│   │   ├── hooks/           # Custom hooks
│   │   ├── i18n/            # Internationalization
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── types.ts         # Type definitions
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vercel.json          # Vercel deployment config
│   ├── vite.config.ts       # Vite configuration
│   ├── .env.example         # Frontend environment variables template
│   └── tsconfig.json        # TypeScript configuration
│
├── backend/                 # Express.js API (deploy to Render)
│   ├── src/                 # Source code
│   │   ├── index.ts         # API entry point
│   │   └── server/          # Server modules
│   │       ├── db.ts        # Database connection
│   │       ├── seed.ts      # Database seeding
│   │       ├── middleware/  # Express middleware
│   │       ├── models/      # Mongoose models
│   │       ├── routes/      # API routes
│   │       ├── services/    # Business logic
│   │       ├── validators/  # Request validation
│   │       └── websocket/   # WebSocket handlers
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Backend environment variables template
│   └── tsconfig.json        # TypeScript configuration
│
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD workflows
│       ├── ci.yml           # Continuous integration
│       └── deploy.yml       # Deployment automation
│
├── render.yaml              # Render deployment blueprint
├── DEPLOYMENT.md            # Detailed deployment guide
├── GITHUB_SECRETS.md        # GitHub secrets configuration
├── phases.md                # Development phases roadmap
├── README.md                # This file
└── package.json             # Root workspace configuration

## Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB Atlas account (for production) or local MongoDB (for development)

## Quick Start (Local Development)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/genmedi.git
cd genmedi

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment Variables

**Frontend:**
```bash
cd frontend
copy .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws/tracking
```

**Backend:**
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
PORT=3000
DATABASE_URL="mongodb://localhost:27017/genmedi"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (if installed locally)
mongod
```

**Option B: MongoDB Atlas**
1. Create a free MongoDB Atlas account
2. Create a cluster and get connection string
3. Update `DATABASE_URL` in `backend/.env` with your Atlas connection string

### 4. Run the Application

**Option 1: Run Frontend and Backend Separately**

Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:3000

Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

**Option 2: Run Both Together**

From project root:
```bash
npm run dev
```

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Medicines
- `GET /api/medicines` - List medicines with search/filter
- `GET /api/medicines/:id` - Get medicine details

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Tracking
- `GET /api/tracking/:orderId` - Get order tracking info
- WebSocket: `ws://localhost:3000/ws/tracking?orderId=xxx` - Real-time tracking

### Compliance
- `GET /api/compliance/records` - Get compliance records
- `POST /api/compliance/disha/data-access` - Log DISHA data access

## Features Implemented

### Phase 3 - Auth & User System
- JWT authentication with access/refresh tokens
- Role-based access control (patient, pharmacist, admin, rider)
- Patient health vault with allergies and addresses
- Pharmacist portal with verification

### Phase 4 - Operations & Delivery
- Razorpay payment gateway integration
- Real-time delivery tracking with WebSocket
- In-app notification center
- Rider management system
- Order lifecycle state machine

### Phase 5 - Intelligence & Scale
- Drug-drug interaction engine with severity levels
- Multi-language support (Hindi, Kannada, Tamil)
- Doctor e-prescribing portal with MCI verification
- PWA with service worker and offline support
- Admin analytics dashboard

### Phase 6 - Compliance & Launch
- Regulatory compliance (DISHA, CDSCO, ABHA)
- Security hardening with audit logging
- Performance optimization with code splitting
- CI/CD pipeline with Docker
- Pre-launch checklist

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run TypeScript check
```

### Backend Development
```bash
cd backend
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run TypeScript check
```

## 🚀 Production Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Summary

1. **MongoDB Atlas Setup**
   - Create free MongoDB Atlas account
   - Create cluster and configure database access
   - Get connection string

2. **Deploy Backend to Render**
   - Connect GitHub repository to Render
   - Configure environment variables
   - Deploy automatically via `render.yaml`

3. **Deploy Frontend to Vercel**
   - Connect GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically via `vercel.json`

4. **Configure GitHub Secrets** (Optional - for CI/CD)
   - See [GITHUB_SECRETS.md](GITHUB_SECRETS.md)

### Manual Deployment

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel or any static hosting
```

**Backend:**
```bash
cd backend
npm run build
npm run start
# Deploy to Render or any Node.js hosting
```

**Docker Deployment:**
```bash
docker-compose up -d
```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_WS_URL` - WebSocket URL for live tracking (optional)

### Backend (.env)
- `GEMINI_API_KEY` - Gemini AI API key
- `APP_URL` - Application URL
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT secret key for access tokens
- `JWT_REFRESH_SECRET` - JWT secret key for refresh tokens
- `RAZORPAY_KEY_ID` - Razorpay key ID (optional)
- `RAZORPAY_KEY_SECRET` - Razorpay key secret (optional)

See `.env.example` files in both directories for detailed templates.

## Troubleshooting

### Frontend not connecting to backend
- Ensure backend is running on port 3000
- Check `VITE_API_URL` in frontend/.env
- Check browser console for CORS errors
- Verify backend CORS settings include your frontend URL

### Backend not starting
- Ensure all dependencies are installed
- Check database connection string in .env
- Check port 3000 is not in use
- Verify MongoDB is accessible

### Database errors
- Confirm MongoDB is running (local or Atlas)
- Check `DATABASE_URL` in backend/.env
- Verify MongoDB Atlas IP whitelist includes your IP
- Check database user credentials

### Deployment Issues
- Check platform-specific logs (Render, Vercel)
- Verify all environment variables are set correctly
- Ensure secrets are not committed to repository
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide for Render, Vercel, and MongoDB Atlas
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment checklist
- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Local development setup guide
- [GITHUB_SECRETS.md](GITHUB_SECRETS.md) - GitHub secrets configuration for CI/CD
- [phases.md](phases.md) - Development phases roadmap and milestones
- [decisions.md](decisions.md) - Architecture and design decisions
- [rules.md](rules.md) - Development rules and guidelines
- [memory.md](memory.md) - Project memory and context

## Development Workflow

### Git Workflow

1. Create a new branch for features:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "Add your feature"
```

3. Push and create pull request:
```bash
git push origin feature/your-feature-name
```

### CI/CD

- **CI**: Automatically runs on push/PR (linting, building)
- **CD**: Automatically deploys to Render/Vercel on main branch push

## Architecture Highlights

### Backend (Express.js + MongoDB)
- RESTful API with TypeScript
- MongoDB with Mongoose ODM
- JWT authentication with refresh tokens
- WebSocket support for real-time tracking
- Comprehensive middleware (auth, validation, audit logging)
- Modular route structure
- Database seeding for development

### Frontend (React + Vite)
- React 19 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Context API for state management
- Internationalization (i18n) support
- PWA capabilities
- Optimized for production deployment

## License

Proprietary - All rights reserved

## Support

For support:
- Check documentation files in project root
- Review deployment logs on respective platforms
- Check GitHub Issues for known problems
