# TELSTP Animal Welfare AI - Deployment Guide

## Overview

This guide covers deploying the TELSTP Animal Welfare & Compassion AI platform to Vercel with Supabase PostgreSQL database integration.

## Prerequisites

- GitHub account with repository access
- Vercel account
- Supabase account with PostgreSQL database
- Environment variables configured

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Console](https://app.supabase.com)
2. Create a new project or use existing project: `TELsTP-OmniCog-Deploy-3`
3. Note the project URL and API keys

### 1.2 Initialize Database Schema

1. Go to Supabase SQL Editor
2. Create a new query
3. Copy the contents of `supabase/schema.sql`
4. Execute the SQL to create all tables, indexes, and RLS policies

### 1.3 Verify Database Connection

```bash
# Test connection with provided credentials
SUPABASE_URL="https://vrfyjirddfdnwuffzqhb.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Step 2: Vercel Deployment

### 2.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import the GitHub repository: `mayoubm1/telstp-animal-welfare-ai`
4. Select the `main` branch

### 2.2 Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

**Database & Authentication:**
- `DATABASE_URL` - MySQL connection string (local dev fallback)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Session cookie signing secret

**OAuth & Authentication:**
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `OWNER_OPEN_ID` - Owner's OpenID
- `OWNER_NAME` - Owner's name

**API Integration:**
- `BUILT_IN_FORGE_API_URL` - Manus built-in APIs URL
- `BUILT_IN_FORGE_API_KEY` - Manus API key (server-side)
- `VITE_FRONTEND_FORGE_API_URL` - Frontend API URL
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

**Analytics & Branding:**
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID
- `VITE_APP_TITLE` - Application title (e.g., "VetAI Care")
- `VITE_APP_LOGO` - Application logo URL

### 2.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (typically 3-5 minutes)
3. Verify deployment at provided Vercel URL

## Step 3: Post-Deployment Verification

### 3.1 Test Application

1. Visit the deployed URL
2. Test landing page loads correctly
3. Test authentication flow (sign in)
4. Test dashboard access
5. Test knowledge base queries

### 3.2 Verify Database Connectivity

```bash
# Check Supabase connection in production
curl -X GET "https://vrfyjirddfdnwuffzqhb.supabase.co/rest/v1/users" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 3.3 Monitor Logs

In Vercel Dashboard:
1. Go to Deployments
2. Click on latest deployment
3. View Function Logs and Edge Logs
4. Check for any errors

## Step 4: Database Migration (Optional)

### 4.1 Migrate from MySQL to Supabase

If you have existing data in MySQL:

```bash
# Export MySQL data
mysqldump -u user -p database > backup.sql

# Import to Supabase (via SQL Editor)
# Copy relevant INSERT statements from backup.sql
```

### 4.2 Update Application to Use Supabase

The application automatically detects and uses Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.

## Troubleshooting

### Issue: Build Fails

**Solution:**
1. Check environment variables are set correctly
2. Verify all required dependencies in `package.json`
3. Check build logs in Vercel dashboard
4. Run `pnpm build` locally to test

### Issue: Database Connection Error

**Solution:**
1. Verify Supabase credentials are correct
2. Check database URL format: `https://[project-ref].supabase.co`
3. Verify service role key has correct permissions
4. Check network connectivity to Supabase

### Issue: Authentication Not Working

**Solution:**
1. Verify OAuth credentials are correct
2. Check `OAUTH_SERVER_URL` is accessible
3. Verify callback URL is whitelisted in OAuth provider
4. Check browser console for specific error messages

## Monitoring & Maintenance

### 1. Set Up Alerts

In Vercel:
- Enable deployment notifications
- Set up error tracking
- Monitor function execution time

### 2. Regular Backups

In Supabase:
- Enable automated backups
- Test restore procedures monthly
- Keep backup retention policy updated

### 3. Performance Optimization

- Monitor database query performance
- Optimize slow queries
- Consider caching strategies
- Use Vercel Edge Functions for low-latency responses

## Rollback Procedure

If deployment has issues:

1. In Vercel Dashboard, go to Deployments
2. Find the previous stable deployment
3. Click "Redeploy"
4. Or use `git revert` and push to main branch

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [tRPC Documentation](https://trpc.io)

## Support

For issues or questions:
1. Check application logs in Vercel
2. Check database logs in Supabase
3. Review error messages in browser console
4. Contact TELSTP support team

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
