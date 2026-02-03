# Git Workflow Guide - Parallel Development (Manus + Termux)

## Initial Setup on Termux (Your Side)

### Step 1: Extract and Initialize Git Repository

```bash
# Extract the zip file
unzip telstp-animal-welfare-ai-deployment.zip
cd telstp-animal-welfare-ai

# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: TELSTP Animal Welfare AI with vet sign-in and clinic locator"
```

### Step 2: Connect to Your Remote Git Repository

```bash
# Add your GitHub/GitLab remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/telstp-animal-welfare-ai.git

# Set the default branch to main
git branch -M main

# Push initial code to remote
git push -u origin main
```

### Step 3: Install Dependencies on Termux

```bash
# Install Node.js (if not already installed)
pkg install nodejs npm

# Install project dependencies
npm install
# or if using pnpm
npm install -g pnpm
pnpm install
```

### Step 4: Set Up Environment Variables

```bash
# Copy the example env file
cp .env.local .env.local.backup

# Edit .env.local with your credentials
nano .env.local

# Required variables to update:
# DATABASE_URL=your_mysql_or_tidb_connection_string
# JWT_SECRET=your_random_secret_key
# VITE_APP_ID=your_oauth_app_id
# OAUTH_SERVER_URL=your_oauth_server_url
# MISTRAL_API_KEY=your_mistral_api_key
```

---

## Daily Workflow - Pulling Latest Changes

### Before Starting Work

```bash
# Fetch latest changes from remote
git fetch origin

# Pull latest main branch
git pull origin main

# Install any new dependencies
npm install
```

---

## Creating Feature Branches

### For Each New Feature/Task

```bash
# Create a new branch from main
git checkout -b feature/your-feature-name

# Example branches for assigned tasks:
git checkout -b feature/i18n-setup
git checkout -b feature/eye-dental-detection
git checkout -b feature/video-upload
git checkout -b feature/treatment-protocols
git checkout -b feature/analytics-dashboard
```

---

## Committing and Pushing Changes

### After Completing a Task

```bash
# Check what files changed
git status

# Stage specific files (or use . for all)
git add client/src/pages/YourNewPage.tsx
git add server/routers/yourRouter.ts
git add package.json

# Commit with descriptive message
git commit -m "feat: Add i18n infrastructure with English/Arabic support

- Set up i18next configuration
- Create translation files for UI strings
- Implement language switcher component
- Add RTL CSS for Arabic layout
- Test on all pages"

# Push to your feature branch
git push origin feature/i18n-setup
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore
**Subject:** 50 characters max, imperative mood
**Body:** Explain what and why, not how
**Footer:** Reference issues, breaking changes

---

## Creating Pull Requests

### When Feature is Complete

```bash
# Push your feature branch
git push origin feature/your-feature-name

# Go to GitHub/GitLab and create a Pull Request
# - Title: Clear description of changes
# - Description: Link to issues, explain changes
# - Assign reviewers if available
```

---

## Syncing with Manus's Changes

### When Manus Pushes Updates

```bash
# Fetch latest changes
git fetch origin

# If you're on main branch
git pull origin main

# If you're on a feature branch, merge main into your branch
git checkout feature/your-feature-name
git merge main

# If there are conflicts, resolve them:
# 1. Open conflicted files
# 2. Look for <<<<<<, ======, >>>>>> markers
# 3. Choose which version to keep
# 4. Remove conflict markers
# 5. Stage and commit

git add .
git commit -m "Merge main into feature/your-feature-name"
git push origin feature/your-feature-name
```

---

## Handling Merge Conflicts

### If Conflicts Occur

```bash
# Check conflict status
git status

# Open conflicted files and resolve manually
# Look for these markers:
# <<<<<<< HEAD (your changes)
# your code
# =======
# incoming code
# >>>>>>> branch-name

# After resolving, stage and commit
git add .
git commit -m "Resolve merge conflicts"
git push origin feature/your-feature-name
```

---

## Reverting Changes (If Needed)

### Undo Last Commit (Not Pushed)

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1
```

### Undo Changes to Specific File

```bash
# Discard changes to a file
git checkout -- path/to/file.ts

# Or restore from staging
git restore path/to/file.ts
```

---

## Viewing History

### Check What Changed

```bash
# View commit history
git log --oneline -10

# View changes in a specific file
git log -p path/to/file.ts

# View who changed each line
git blame path/to/file.ts

# View diff between branches
git diff main feature/your-feature-name
```

---

## Task Assignment Summary

### Your Tasks (Termux Side):

**Phase 7:** Multi-Language Support (i18n) & RTL
- Branch: `feature/i18n-setup`
- Deliverable: Language switcher, translation files, RTL support

**Phase 9:** Eye & Dental Condition Detection
- Branch: `feature/eye-dental-detection`
- Deliverable: Image analysis UI, detection results display

**Phase 11:** Video Upload & Consultation Recordings
- Branch: `feature/video-upload`
- Deliverable: Video upload interface, playback component

**Phase 13:** Treatment Protocol & Recommendations
- Branch: `feature/treatment-protocols`
- Deliverable: Protocol UI, dosage calculator, follow-up reminders

**Phase 15:** Analytics & Monitoring
- Branch: `feature/analytics-dashboard`
- Deliverable: Analytics page, tracking implementation

### Manus's Tasks (Server Side):

**Phase 8:** Emergency Triage & Critical Cases
- Branch: `feature/emergency-triage`
- Deliverable: Triage procedures, alert system

**Phase 10:** Real-Time Camera Feed & Live Analysis
- Branch: `feature/live-camera-analysis`
- Deliverable: WebSocket support, real-time detection

**Phase 12:** Case History & Visual Comparison
- Branch: `feature/case-history`
- Deliverable: Case CRUD, comparison tracking, timeline

**Phase 14:** Push Notifications & Real-Time Alerts
- Branch: `feature/push-notifications`
- Deliverable: Notification system, alert logic

---

## Quick Reference Commands

```bash
# Clone repo (first time)
git clone https://github.com/YOUR_USERNAME/telstp-animal-welfare-ai.git

# Check current branch
git branch

# Switch to a branch
git checkout branch-name

# Create and switch to new branch
git checkout -b branch-name

# Stage all changes
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push origin branch-name

# Pull latest from remote
git pull origin main

# View status
git status

# View recent commits
git log --oneline -5

# Undo last commit (local only)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard origin/main
```

---

## Communication Protocol

1. **Before Starting:** Comment on the GitHub issue or Slack that you're starting a task
2. **During Development:** Push commits frequently (at least daily)
3. **When Complete:** Create a Pull Request with clear description
4. **Code Review:** Wait for review before merging to main
5. **After Merge:** Delete the feature branch and pull latest main

---

## Troubleshooting

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub/GitLab
cat ~/.ssh/id_ed25519.pub
```

### "Your branch is ahead of origin/main"
```bash
# Push your commits
git push origin feature/your-feature-name
```

### "Your branch has diverged"
```bash
# Rebase on latest main
git fetch origin
git rebase origin/main

# If conflicts, resolve them then:
git rebase --continue
```

---

## Next Steps

1. ✅ Extract zip file and initialize git
2. ✅ Connect to your remote repository
3. ✅ Install dependencies
4. ✅ Set up environment variables
5. ✅ Create your first feature branch
6. ✅ Start working on Phase 7 (i18n)
7. ✅ Push commits daily
8. ✅ Create PR when feature is complete

**Ready to start? Begin with Phase 7: Multi-Language Support!**
