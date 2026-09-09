# Genmedi - Generic Medicine Delivery Platform

A complete e-pharmacy platform for affordable generic medicines with 45-minute delivery in India.

## Project Structure

```
genmedi/
├── frontend/          # React + Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── .env.example   # Frontend environment variables
│
├── backend/           # Express.js backend API
│   ├── src/           # API entry point, routes, middleware, services, models
│   ├── package.json   # Backend dependencies
│   └── .env.example   # Backend environment variables
│
└── README.md          # This file
```

## Prerequisites

- Node.js 20+ 
- npm or yarn
- MongoDB 7 (locally, through Docker, or MongoDB Atlas)

## Installation

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:3000
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Configure environment variables in `.env`:
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

MongoDB runs separately. Start a local MongoDB service, or use `docker compose up -d mongo` from the project root.

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Option 2: Run Both Together (Using Concurrently)

1. Install the root workspace helper:
```bash
npm install
```

2. Run both:
```bash
npm run dev
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
- WebSocket: `ws://localhost:8080?orderId=xxx` - Real-time tracking

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

## Production Deployment

### Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up -d
```

### Manual Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Build backend:
```bash
cd backend
npm run build
```

3. Start backend server:
```bash
cd backend
npm run start
```

4. Serve frontend static files with nginx or similar

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

### Backend (.env)
- `GEMINI_API_KEY` - Gemini AI API key
- `APP_URL` - Application URL
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT secret key
- `JWT_REFRESH_SECRET` - JWT refresh secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

## Troubleshooting

### Frontend not connecting to backend
- Ensure backend is running on port 3000
- Check `VITE_API_URL` in frontend/.env
- Check browser console for CORS errors

### Backend not starting
- Ensure all dependencies are installed
- Check database connection string in .env
- Check port 3000 is not in use

### Database errors
- Confirm MongoDB is running
- Check `DATABASE_URL` in backend/.env

## License

Proprietary - All rights reserved

## Support

For support, contact the development team.
