# TELSTP Animal Welfare AI - Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Supabase Schema Migration (REQUIRED FIRST STEP)

**Execute this BEFORE deploying to Vercel:**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire content from `supabase/schema-integration.sql` in this repository
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

**Expected Output:**
- 13 new tables created
- All indexes and triggers applied
- RLS policies enabled
- No errors

**Verify Success:**
- Go to **Database** → **Tables**
- You should see: `veterinary_profiles`, `pets`, `pet_cases`, `vet_consultations`, etc.

---

## Vercel Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Choose: `mayoubm1/telstp-animal-welfare-ai`
5. Click **Import**

### Step 2: Configure Environment Variables

In Vercel Project Settings → **Environment Variables**, add all of these:

```
# Database - Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.vrfyjirddfdnwuffzqhb:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supabase Auth & API
SUPABASE_URL=https://vrfyjirddfdnwuffzqhb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnlqaXJkZGZkbnd1ZmZ6cWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDYwNjMsImV4cCI6MjA3NTQ4MjA2M30.glgJwI2yIqUFG8ZtWJk2esxGdXw6nFp5eQ8aANbRAvE
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Mistral AI
MISTRAL_API_KEY=[YOUR_MISTRAL_API_KEY]

# Manus OAuth
VITE_APP_ID=[YOUR_MANUS_APP_ID]
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=[YOUR_MANUS_OAUTH_PORTAL_URL]

# JWT & Security
JWT_SECRET=[GENERATE_SECURE_RANDOM_STRING]

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=[YOUR_FORGE_API_URL]
BUILT_IN_FORGE_API_KEY=[YOUR_FORGE_API_KEY]
VITE_FRONTEND_FORGE_API_URL=[YOUR_FRONTEND_FORGE_API_URL]
VITE_FRONTEND_FORGE_API_KEY=[YOUR_FRONTEND_FORGE_API_KEY]

# Owner Information
OWNER_OPEN_ID=[YOUR_OWNER_OPEN_ID]
OWNER_NAME=[YOUR_NAME]

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=[OPTIONAL]
VITE_ANALYTICS_WEBSITE_ID=[OPTIONAL]

# App Configuration
VITE_APP_TITLE=TELSTP Animal Welfare AI
VITE_APP_LOGO=[YOUR_LOGO_URL]
NODE_ENV=production
```

### Step 3: Build Settings

Vercel should auto-detect the build configuration:

- **Framework**: Next.js / Vite (auto-detected)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (typically 3-5 minutes)
3. Verify deployment URL

---

## Post-Deployment Verification

### 1. Test Landing Page
- Visit your Vercel URL
- Verify landing page loads
- Check responsive design

### 2. Test Authentication
- Click "Get Started" or "Sign In"
- Complete OAuth flow
- Verify redirect to dashboard

### 3. Test Knowledge Base
- Navigate to `/knowledge-base`
- Verify vaccination protocols load
- Verify supplements information displays

### 4. Test Mistral Integration
- Create a test case with symptoms
- Verify AI diagnosis generates
- Check response formatting

### 5. Monitor Logs
- Go to Vercel Dashboard → **Deployments**
- Click latest deployment → **Logs**
- Check for any errors

---

## Database Connection Troubleshooting

### Issue: "Connection refused"
**Solution:** Verify `DATABASE_URL` format and Supabase is accessible from Vercel

### Issue: "Authentication failed"
**Solution:** Check `SUPABASE_ANON_KEY` and `SUPABASE_URL` are correct

### Issue: "RLS policy violation"
**Solution:** Ensure RLS policies were created in Supabase (run schema-integration.sql)

---

## Scaling Considerations

### Database Connection Pooling
- Supabase automatically handles connection pooling
- No additional configuration needed

### Rate Limiting
- Mistral API: Implement rate limiting in `server/_core/mistral.ts`
- Vercel: 10GB bandwidth/month on Pro plan

### Caching
- Implement Redis caching for knowledge base queries
- Cache Mistral responses for common symptoms

---

## Monitoring & Maintenance

### Vercel Analytics
- Monitor performance in Vercel Dashboard
- Check deployment status regularly

### Supabase Monitoring
- Monitor database usage in Supabase Dashboard
- Check RLS policy performance
- Review query logs for optimization

### Error Tracking
- Implement Sentry or similar for error tracking
- Monitor Mistral API errors
- Track user feedback

---

## Rollback Procedure

If deployment fails:

1. Go to Vercel Dashboard → **Deployments**
2. Find previous successful deployment
3. Click **Promote to Production**

---

## Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Go to Vercel → Project Settings → Domains
   - Add your custom domain

2. **Enable analytics** (optional)
   - Configure analytics endpoint in environment variables

3. **Set up monitoring** (optional)
   - Integrate Sentry for error tracking
   - Set up uptime monitoring

4. **Populate knowledge base** (recommended)
   - Add vaccination protocols
   - Add disease information
   - Add educational content

5. **Invite veterinarians**
   - Create veterinarian accounts
   - Verify credentials
   - Enable consultation features

---

## Support & Troubleshooting

For deployment issues:
1. Check Vercel logs: `vercel logs [project-name]`
2. Check Supabase logs: Dashboard → **Logs**
3. Review environment variables
4. Verify GitHub repository is up to date

---

## Security Checklist

- [ ] All secrets are in Vercel environment variables (not in code)
- [ ] DATABASE_URL uses Supabase connection pooler
- [ ] JWT_SECRET is strong and unique
- [ ] RLS policies are enabled in Supabase
- [ ] OAuth credentials are correct
- [ ] CORS is configured properly
- [ ] HTTPS is enforced

---

**Deployment Status:** Ready for Vercel
**Last Updated:** February 2, 2026
**Estimated Deployment Time:** 5-10 minutes
