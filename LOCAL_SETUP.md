# Local Development Setup Guide

This guide helps you set up the Genmedi project for local development with MongoDB Atlas or local MongoDB.

## Option 1: MongoDB Atlas (Recommended for Production-like Testing)

### Prerequisites
- MongoDB Atlas account (free tier available)
- Node.js 20+

### Setup Steps

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up and create a free M0 cluster
   - Choose a region close to you (e.g., Mumbai for India)

2. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create a user with username and password
   - Set privileges to "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add your current IP address
   - Or add `0.0.0.0/0` to allow all IPs (less secure)

4. **Get Connection String**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/genmedi?retryWrites=true&w=majority`

5. **Configure Backend Environment**
   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `backend/.env`:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/genmedi?retryWrites=true&w=majority"
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   ```

6. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

7. **Seed Database (Optional)**
   ```bash
   cd backend
   npm run seed
   ```

## Option 2: Local MongoDB (For Development)

### Prerequisites
- MongoDB installed locally
- Node.js 20+

### Setup Steps

1. **Install MongoDB**
   - **Windows**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   - **Windows**: Start MongoDB service from Services or run `mongod`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Configure Backend Environment**
   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `backend/.env`:
   ```
   DATABASE_URL="mongodb://localhost:27017/genmedi"
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   ```

4. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

5. **Seed Database (Optional)**
   ```bash
   cd backend
   npm run seed
   ```

## Option 3: Docker MongoDB (For Development)

### Prerequisites
- Docker installed
- Node.js 20+

### Setup Steps

1. **Start MongoDB with Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Configure Backend Environment**
   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `backend/.env`:
   ```
   DATABASE_URL="mongodb://localhost:27017/genmedi"
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Seed Database (Optional)**
   ```bash
   cd backend
   npm run seed
   ```

## Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   copy .env.example .env
   ```

   Edit `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_WS_URL=ws://localhost:3000/ws/tracking
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

## Running Both Services

### Option 1: Separate Terminals
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

### Option 2: Root Workspace
```bash
# From project root
npm install
npm run dev
```

## Testing Without Database

The backend is configured to start even without database connection. Some features will not work, but you can test:

- Frontend UI and navigation
- API health check endpoint
- Static data views (if implemented)

To test without database:
1. Configure `DATABASE_URL` with invalid credentials or local MongoDB that's not running
2. Start backend - it will warn but continue running
3. Start frontend
4. Note: Database-dependent features will return errors

## Troubleshooting

### MongoDB Connection Issues

**Error**: "MongoServerError: bad auth : authentication failed"
- **Solution**: Verify username and password in connection string
- **Solution**: Check database user permissions in Atlas

**Error**: "MongoNetworkError: failed to connect to server"
- **Solution**: Check MongoDB service is running (local)
- **Solution**: Verify IP whitelist in Atlas Network Access
- **Solution**: Check firewall settings

**Error**: "Connection timeout"
- **Solution**: Increase `serverSelectionTimeoutMS` in db.ts
- **Solution**: Check network connectivity to Atlas

### Port Conflicts

**Error**: "EADDRINUSE: address already in use"
- **Solution**: Kill process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill //F //PID <PID>
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Frontend Issues

**Error**: "Failed to fetch"
- **Solution**: Verify backend is running on port 3000
- **Solution**: Check `VITE_API_URL` in frontend/.env
- **Solution**: Check browser console for CORS errors

**Error**: "Module not found"
- **Solution**: Run `npm install` in frontend directory
- **Solution**: Clear node_modules and reinstall

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Environment Variables**: Never commit .env files (they're in .gitignore)
3. **Database Seeding**: Use `npm run seed` to populate database with test data
4. **API Testing**: Use tools like Postman or curl to test API endpoints
5. **Logs**: Check terminal output for backend logs and browser console for frontend logs

## API Endpoints for Testing

Once backend is running:

```bash
# Health check
curl http://localhost:3000/api/health

# Get medicines (requires database)
curl http://localhost:3000/api/medicines

# Get hubs (requires database)
curl http://localhost:3000/api/hubs
```

## Next Steps

After local setup is working:
1. Test all API endpoints
2. Verify frontend-backend integration
3. Configure production MongoDB Atlas credentials
4. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment