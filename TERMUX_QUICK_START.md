# Termux Quick Start Guide - TELSTP Animal Welfare AI

## Copy-Paste Commands for Immediate Setup

### 1. Extract and Navigate to Project

```bash
unzip telstp-animal-welfare-ai-deployment.zip
cd telstp-animal-welfare-ai
```

### 2. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: TELSTP Animal Welfare AI"
```

### 3. Connect to Your GitHub Repository

```bash
# Replace YOUR_USERNAME and YOUR_REPO with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 4. Install Dependencies

```bash
# Install Node.js if needed
pkg install nodejs npm -y

# Install project dependencies
npm install
```

### 5. Set Up Environment Variables

```bash
# Edit the environment file
nano .env.local

# Add these variables (ask for values from Manus):
# DATABASE_URL=
# JWT_SECRET=
# VITE_APP_ID=
# OAUTH_SERVER_URL=
# MISTRAL_API_KEY=

# Save: Ctrl+X, then Y, then Enter
```

### 6. Start Development Server

```bash
npm run dev
```

---

## Your First Task: Phase 7 - Multi-Language Support (i18n)

### Create Feature Branch

```bash
git checkout -b feature/i18n-setup
```

### What You Need to Do

1. **Set up i18n infrastructure**
   - Install i18next: `npm install i18next react-i18next`
   - Create config file: `client/src/i18n/config.ts`
   - Initialize i18n in `client/src/main.tsx`

2. **Create translation files**
   - Create `client/src/i18n/locales/en.json` (English)
   - Create `client/src/i18n/locales/ar.json` (Arabic)
   - Add all UI strings from pages

3. **Build language switcher**
   - Create `client/src/components/LanguageSwitcher.tsx`
   - Add to header/navigation

4. **Implement RTL support**
   - Update `client/src/index.css` with RTL styles
   - Add `dir="rtl"` to HTML when Arabic is selected

5. **Test on all pages**
   - Switch between English and Arabic
   - Verify layout adjusts correctly

### Commit and Push

```bash
# After each significant change
git add .
git commit -m "feat: Add i18n infrastructure

- Installed i18next and react-i18next
- Created English and Arabic translation files
- Built language switcher component
- Implemented RTL CSS support"

git push origin feature/i18n-setup
```

---

## Daily Workflow

### Before Starting Work

```bash
git fetch origin
git pull origin main
npm install
```

### During Development

```bash
# Make changes to files
# Test locally
npm run dev

# Commit frequently
git add .
git commit -m "feat: Add language switcher component"
git push origin feature/i18n-setup
```

### When Feature is Complete

```bash
# Make final commit
git push origin feature/i18n-setup

# Go to GitHub and create a Pull Request
# - Title: "feat: Multi-language support with i18n and RTL"
# - Description: List all changes
# - Wait for review
```

---

## Manus Will Be Working On

While you work on i18n, Manus will be:

1. **Phase 8:** Emergency Triage System
   - Building backend procedures for emergency assessment
   - Creating alert system for critical cases
   - Implementing urgent case routing

2. **Phase 10:** Real-Time Camera Feed
   - Setting up WebSocket support
   - Building live symptom detection
   - Creating real-time results display

3. **Phase 12:** Case History & Tracking
   - Building case CRUD operations
   - Implementing visual comparison tracking
   - Creating timeline view

4. **Phase 14:** Push Notifications
   - Setting up notification system
   - Creating alert logic
   - Building notification preferences UI

---

## Syncing With Manus's Changes

### When Manus Pushes Updates to Main

```bash
# Stop your dev server (Ctrl+C)

# Fetch and merge latest changes
git fetch origin
git merge origin/main

# If there are conflicts, resolve them
# Then continue:
git add .
git commit -m "Merge main into feature/i18n-setup"

# Reinstall dependencies if package.json changed
npm install

# Restart dev server
npm run dev
```

---

## Troubleshooting

### "npm: command not found"
```bash
pkg install nodejs npm -y
```

### "Permission denied" when pushing
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub Settings → SSH and GPG keys
cat ~/.ssh/id_ed25519.pub
```

### "Merge conflict" when pulling
```bash
# Open conflicted files and resolve
# Look for <<<<<<, ======, >>>>>> markers
# Choose which version to keep
git add .
git commit -m "Resolve merge conflicts"
git push origin feature/i18n-setup
```

### Dev server not starting
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Key Files for i18n Task

- `client/src/i18n/config.ts` - i18n configuration
- `client/src/i18n/locales/en.json` - English translations
- `client/src/i18n/locales/ar.json` - Arabic translations
- `client/src/components/LanguageSwitcher.tsx` - Language switcher
- `client/src/index.css` - RTL styles
- `client/src/main.tsx` - i18n initialization
- `client/src/pages/*.tsx` - Update to use i18n

---

## Communication

**When you're ready to start:**
- Create the feature branch: `git checkout -b feature/i18n-setup`
- Push it: `git push origin feature/i18n-setup`
- Message Manus: "Starting Phase 7: i18n setup"

**Daily updates:**
- Push commits at least once per day
- Message progress: "Completed language switcher, working on RTL"

**When complete:**
- Push final changes
- Create Pull Request on GitHub
- Message: "Phase 7 complete, PR ready for review"

---

## Next Steps

1. ✅ Extract zip file
2. ✅ Initialize git and connect to GitHub
3. ✅ Install dependencies
4. ✅ Set up environment variables
5. ✅ Create feature branch: `git checkout -b feature/i18n-setup`
6. ✅ Start Phase 7: Multi-Language Support
7. ✅ Push commits daily
8. ✅ Create PR when complete

**You're ready to go! Start with Phase 7 now!**
