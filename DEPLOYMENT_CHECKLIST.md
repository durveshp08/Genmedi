# Genmedi Deployment Checklist

This checklist helps you deploy the Genmedi platform to production with Render (backend), Vercel (frontend), and MongoDB Atlas (database).

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code changes are committed to Git
- [ ] Project structure is properly organized (backend/ and frontend/ separate)
- [ ] `.env.example` files are updated with production-ready variables
- [ ] No sensitive data (API keys, passwords) in committed files
- [ ] `.gitignore` properly excludes `.env` files
- [ ] Code passes TypeScript linting (`npm run lint`)
- [ ] Code builds successfully (`npm run build`)

### 2. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 for development, M10+ for production)
- [ ] Database user created with appropriate permissions
- [ ] Network access configured (IP whitelist or VPC peering)
- [ ] Connection string obtained and tested
- [ ] Database tested locally with connection string

### 3. API Keys and Secrets
- [ ] Gemini AI API key obtained
- [ ] Razorpay keys obtained (if using payments)
- [ ] JWT secrets generated (64+ character random strings)
- [ ] All secrets stored securely (not in code)

### 4. GitHub Repository
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] `.github/workflows/` files committed
- [ ] Repository is public or private as required

## Backend Deployment (Render)

### 1. Render Account Setup
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Billing configured (if using paid tier)

### 2. Render Service Creation
- [ ] New web service created
- [ ] GitHub repository connected
- [ ] `render.yaml` detected and used for configuration
- [ ] Build command: `npm ci && npm run build`
- [ ] Start command: `npm run start`
- [ ] Health check path: `/api/health`

### 3. Environment Variables
- [ ] `DATABASE_URL` - MongoDB Atlas connection string
- [ ] `FRONTEND_URL` - Vercel frontend URL (after frontend deployment)
- [ ] `GEMINI_API_KEY` - Gemini AI API key
- [ ] `JWT_SECRET` - Generated strong secret
- [ ] `JWT_REFRESH_SECRET` - Generated strong secret
- [ ] `RAZORPAY_KEY_ID` - Razorpay key ID (optional)
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay key secret (optional)
- [ ] `APP_URL` - Render backend URL (auto-generated)
- [ ] `PORT` - Set to 3000

### 4. Backend Verification
- [ ] Backend builds successfully on Render
- [ ] Backend starts without errors
- [ ] Health check endpoint returns `{"status":"ok"}`
- [ ] Database connection successful
- [ ] API endpoints respond correctly

## Frontend Deployment (Vercel)

### 1. Vercel Account Setup
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Team created (if needed)

### 2. Vercel Project Creation
- [ ] New project created from GitHub
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] `vercel.json` configuration detected

### 3. Environment Variables
- [ ] `VITE_API_URL` - Render backend URL
- [ ] `VITE_WS_URL` - Backend WebSocket URL (optional)

### 4. Frontend Verification
- [ ] Frontend builds successfully on Vercel
- [ ] Frontend loads without errors
- [ ] API calls to backend successful
- [ ] No CORS errors in browser console
- [ ] All features working as expected

## Post-Deployment Configuration

### 1. Update Backend CORS
- [ ] Update `FRONTEND_URL` in Render with actual Vercel URL
- [ ] Redeploy backend to apply CORS changes

### 2. Database Seeding (Optional)
- [ ] Seed production database if needed
- [ ] Verify seed data is appropriate for production
- [ ] Test seeded data through API

### 3. GitHub CI/CD (Optional)
- [ ] GitHub secrets configured:
  - [ ] `RENDER_API_KEY`
  - [ ] `RENDER_SERVICE_ID`
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] CI workflow tested
- [ ] CD workflow tested
- [ ] Automatic deployment on push to main

## Final Verification

### 1. Health Checks
- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Database connection verified
- [ ] API endpoints tested

### 2. Integration Testing
- [ ] Frontend can call backend APIs
- [ ] Authentication flow works (if implemented)
- [ ] Data persistence works
- [ ] WebSocket connections work (if implemented)

### 3. Performance
- [ ] Backend response times acceptable
- [ ] Frontend load times acceptable
- [ ] Database queries optimized
- [ ] No memory leaks detected

### 4. Security
- [ ] HTTPS enabled on both platforms
- [ ] Environment variables not exposed
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if needed)
- [ ] Authentication/authorization working

### 5. Monitoring
- [ ] Render logs monitoring set up
- [ ] Vercel analytics enabled
- [ ] MongoDB Atlas monitoring configured
- [ ] Error tracking set up (optional)

## Troubleshooting

### Common Issues

**Backend won't start**
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Check MongoDB Atlas connectivity
- Verify environment variables are set

**Frontend can't connect to backend**
- Verify VITE_API_URL is correct
- Check CORS configuration
- Verify backend is running
- Check browser console for errors

**Database connection fails**
- Verify MongoDB Atlas credentials
- Check IP whitelist settings
- Verify connection string format
- Check network connectivity

**Build failures**
- Check platform-specific build logs
- Verify dependencies are installable
- Check for platform-specific issues
- Verify build commands are correct

## Rollback Plan

### If Deployment Fails
1. Keep previous deployment running
2. Identify the issue
3. Fix the issue in development
4. Test locally
5. Deploy to staging environment
6. Deploy to production after verification

### If Critical Issues Post-Deployment
1. Revert to previous working version
2. Investigate the issue
3. Fix and test
4. Redeploy

## Maintenance

### Regular Tasks
- [ ] Monitor logs daily (first week)
- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Update dependencies regularly
- [ ] Security audits periodically
- [ ] Backup database regularly

### Scaling Considerations
- [ ] Monitor resource usage
- [ ] Plan for traffic increases
- [ ] Consider CDN for static assets
- [ ] Implement caching strategies
- [ ] Optimize database queries

## Documentation

- [ ] Update deployment documentation with actual URLs
- [ ] Document any custom configurations
- [ ] Keep team informed of deployment status
- [ ] Maintain runbooks for common issues

## Support Contacts

- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Atlas Support**: https://docs.atlas.mongodb.com/support/
- **Project Team**: [Add contact information]

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: ___________
**Notes**: ___________