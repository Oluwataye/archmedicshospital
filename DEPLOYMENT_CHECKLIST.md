# 🚀 Deployment Checklist

Use this checklist when deploying your ARCHMEDICS HMS to production.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser (F12)
- [ ] All environment variables documented
- [ ] Database migrations tested
- [ ] Seed data reviewed

### Security
- [ ] Changed default JWT_SECRET in production
- [ ] Changed all default passwords
- [ ] Reviewed user permissions
- [ ] CORS configured correctly
- [ ] HTTPS enabled (Railway provides this automatically)

### Database
- [ ] Backup current database (if updating)
- [ ] Test migrations on staging database
- [ ] Verify seed data is appropriate for production

## Backend Deployment (Railway)

### Initial Setup
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] PostgreSQL database added
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<unique-secret>`
  - [ ] `PORT=3001`
  - [ ] `DATABASE_URL` (auto-set by Railway)
  - [ ] `FRONTEND_URL=<your-smartweb-domain>`

### Deployment
- [ ] Code pushed to GitHub
- [ ] Railway auto-deployed successfully
- [ ] Database migrations run: `npm run db:setup`
- [ ] Health check endpoint working: `https://your-app.railway.app/health`
- [ ] API endpoints responding correctly

### Post-Deployment Testing
- [ ] Test login endpoint
- [ ] Test HMO providers endpoint
- [ ] Test claims endpoint
- [ ] Test pre-auth endpoint
- [ ] Verify database connection
- [ ] Check logs for errors

## Frontend Deployment (Smartweb)

### Build Preparation
- [ ] Update API URL in service files to Railway URL
- [ ] Test build locally: `npm run build`
- [ ] Verify dist folder created
- [ ] Check dist/index.html exists

### Upload to Smartweb
- [ ] Login to cPanel
- [ ] Navigate to public_html
- [ ] Backup existing files (if any)
- [ ] Upload all files from dist folder
- [ ] Create/update .htaccess file
- [ ] Set correct file permissions (644 for files, 755 for folders)

### Domain Configuration
- [ ] Domain pointing to Smartweb server
- [ ] SSL certificate installed (if available)
- [ ] www redirect configured (optional)

### Post-Deployment Testing
- [ ] Homepage loads correctly
- [ ] Login page accessible
- [ ] Can login with test credentials
- [ ] Dashboard loads after login
- [ ] Navigation works (no 404 errors)
- [ ] API calls successful (check browser console)
- [ ] Images and assets loading
- [ ] Mobile responsive design working

## Final Verification

### Functionality Testing
- [ ] User login/logout works
- [ ] Patient management works
- [ ] HMO provider management works
- [ ] Claims creation and submission works
- [ ] Pre-authorization workflow works
- [ ] Reports generate correctly
- [ ] All user roles accessible

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No memory leaks in browser
- [ ] Database queries optimized

### Monitoring
- [ ] Railway logs accessible
- [ ] Error tracking set up (optional)
- [ ] Uptime monitoring (optional)
- [ ] Database backup schedule (Railway auto-backups)

## Rollback Plan

If something goes wrong:

### Backend Rollback
1. Go to Railway dashboard
2. Click "Deployments"
3. Select previous working deployment
4. Click "Redeploy"

### Frontend Rollback
1. Login to Smartweb cPanel
2. Restore from backup
3. Or re-upload previous dist folder

### Database Rollback
1. Railway provides automatic backups
2. Go to Database → Backups
3. Restore to previous state

## Common Issues & Solutions

### Backend Issues
- **503 Error**: Check Railway logs, might be out of memory
- **Database Connection Failed**: Verify DATABASE_URL is set
- **CORS Error**: Add frontend URL to CORS whitelist

### Frontend Issues
- **404 on Refresh**: .htaccess not configured correctly
- **API Connection Failed**: Check API URL in service files
- **Blank Page**: Check browser console for errors

## Post-Deployment Tasks

- [ ] Update documentation with production URLs
- [ ] Notify team of deployment
- [ ] Create admin accounts for real users
- [ ] Delete test/demo data
- [ ] Set up regular database backups
- [ ] Monitor application for 24 hours
- [ ] Document any issues encountered

## Maintenance Schedule

### Daily
- Check Railway logs for errors
- Monitor application performance

### Weekly
- Review user feedback
- Check database size
- Update dependencies if needed

### Monthly
- Full backup verification
- Security audit
- Performance optimization review

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Production URL**: _____________

**Backend URL**: _____________

**Notes**: _____________________________________________
