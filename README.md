# 🏥 ARCHMEDICS Hospital Management System

A comprehensive, modern Hospital Management System built with React, TypeScript, and Node.js. Manage patients, HMO providers, claims, pre-authorizations, and more!

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Local Installation](#-local-installation-windows)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Deployment Guide](#-deployment-guide)
- [Default Login Credentials](#-default-login-credentials)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)

---

## ✨ Features

- 👥 **Multi-Role Access**: Admin, Doctor, Nurse, Cashier, Pharmacist, Lab Tech, EHR
- 🏥 **Patient Management**: Complete patient records and medical history
- 💊 **HMO Integration**: Provider management, claims, pre-authorizations
- 💰 **Billing & Payments**: Cashier dashboard with multiple payment methods
- 📊 **Reports & Analytics**: Comprehensive reporting system
- 🔐 **Secure Authentication**: JWT-based authentication
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

---

## 📦 Prerequisites

Before you start, make sure you have these installed/created:

### Required Software & Accounts

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version.
   - To check if installed: Open Command Prompt and type `node --version`

2. **Git** (for cloning the project)
   - Download from: https://git-scm.com/
   - To check if installed: Type `git --version` in Command Prompt

3. **VS Code** (Text Editor)
   - Download from: https://code.visualstudio.com/

4. **GitHub Account** (Required for deployment)
   - Sign up at: https://github.com/

---

## 💻 Local Installation (Windows)

Follow these steps carefully. Each command should be run in Command Prompt or PowerShell.

### Step 1: Clone the Project

Open Command Prompt and navigate to where you want to save the project:

```bash
# Navigate to your Documents folder
cd Documents

# Clone the repository
git clone <YOUR_GIT_URL>

# Go into the project folder
cd archmedics-hms-offline-main
```

### Step 2: Install Dependencies

This will download all the required packages (might take 2-5 minutes):

```bash
npm install
```

### Step 3: Set Up Environment Variables

1. Find the file named `.env.example` in the project folder.
2. Copy and paste it, then rename the copy to `.env`.
3. Open `.env` in VS Code.
4. **Important**: Change the `JWT_SECRET` to something unique (like a long password):

```env
JWT_SECRET=change-this-to-something-secret-123
```

### Step 4: Set Up the Database

Run these commands one by one to set up your local database:

```bash
# Create database tables
npm run migrate:latest

# Add sample data (admin user, HMO providers, etc.)
npm run seed:run
```

✅ **Success!** Your local database is ready.

---

## 🗄️ Database Setup

- **Local Development**: Uses **SQLite**. No installation needed. The file is created at `data/archmedics_hms.db`.
- **Production (Railway)**: Uses **PostgreSQL**. This is set up automatically during deployment.

### Useful Database Commands

```bash
# Run migrations (create tables)
npm run migrate:latest

# Reset database (WARNING: Deletes all data!)
npm run db:reset
```

---

## 🚀 Running the Application

### Development Mode (Local)

You need to open **TWO** Command Prompt windows to run the app.

**Window 1 - Frontend (The visible part):**
```bash
npm run dev
```
- Runs at: http://localhost:8080

**Window 2 - Backend (The logic part):**
```bash
npm run start:prod
```
- Runs at: http://localhost:3001

### Access the Application

1. Open your browser (Chrome, Edge, etc.).
2. Go to: http://localhost:8080
3. Login with default credentials (see below).

---

## 🌐 Deployment Guide

This guide explains how to put your app on the internet. We use **Railway** for the backend (logic & database) and **Smartweb** for the frontend (visuals).

### Part 1: Push Code to GitHub

Before deploying, your code must be on GitHub.

1. Create a new repository on GitHub.com.
2. Run these commands in your project folder:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

### Part 2: Deploy Backend to Railway (GitHub + Railway)

Railway hosts your backend for free!

#### Step 1: Create Railway Account
1. Go to https://railway.app/
2. Click "Login" and select **"Login with GitHub"**.

#### Step 2: Deploy Backend
1. Click **"New Project"** → **"Deploy from GitHub repo"**.
2. Select your `archmedics-hms-offline-main` repository.
3. Click **"Deploy Now"**.

#### Step 3: Add Variables
1. Click on your project card.
2. Go to the **"Variables"** tab.
3. Add these variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(create a long random password)`
   - `PORT` = `3001`

#### Step 4: Add Database
1. In your project view, click **"New"** (or Command+K) → **"Database"** → **"Add PostgreSQL"**.
2. Railway will automatically connect it.
3. Wait for the database to initialize.

#### Step 5: Setup Database Tables
1. Go to **"Settings"** tab of your Node.js service.
2. Scroll to **"Deploy"** section.
3. In **"Build Command"**, enter: `npm install && npm run build`
4. In **"Start Command"**, enter: `npm run db:setup && npm run start:prod`
   - *Note: `npm run db:setup` runs migrations every time you deploy.*

#### Step 6: Get Your API URL
1. Go to **"Settings"** → **"Networking"**.
2. Under "Public Networking", click **"Generate Domain"**.
3. Copy this URL (e.g., `https://archmedics-production.up.railway.app`).
4. **Save this URL!** You need it for the frontend.

### Part 3: Deploy Frontend to Smartweb

#### Step 1: Connect Frontend to Backend
1. Open `src/services/apiService.ts` (and `hmoService.ts` if separate).
2. Find the `API_BASE_URL` line.
3. Change it to your Railway URL:
   ```typescript
   // Example
   const API_BASE_URL = 'https://archmedics-production.up.railway.app/api';
   ```
4. Save the file.

#### Step 2: Build the Frontend
Run this command to create the production files:
```bash
npm run build
```
This creates a `dist` folder.

#### Step 3: Upload to Smartweb
1. Login to your **cPanel** on Smartweb.
2. Go to **"File Manager"**.
3. Open the `public_html` folder (or your subdomain folder).
4. Click **"Upload"**.
5. Drag and drop **ALL FILES inside the `dist` folder** (index.html, assets folder, etc.).
   - *Do not upload the `dist` folder itself, just its contents.*

#### Step 4: Fix Routing (.htaccess)
1. In File Manager, create a new file named `.htaccess`.
2. Edit it and paste this code:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
3. Save.

🎉 **Congratulations! Your Hospital System is LIVE!**

---

## 🔑 Default Login Credentials

**⚠️ CHANGE THESE AFTER LOGGING IN!**

### Admin
- **Email**: admin@archmedics.com
- **Password**: admin123

### Staff
- **Doctor**: doctor@archmedics.com / doctor123
- **Nurse**: nurse@archmedics.com / nurse123
- **Cashier**: cashier@archmedics.com / cashier123
- **Pharmacist**: pharmacist@archmedics.com / pharmacist123

---

## 🔧 Troubleshooting

### "npm command not found"
- You didn't install Node.js. Install it and restart your computer.

### "Port 3001 already in use"
- The backend is already running in another window. Close it or use a different port in `.env`.

### "Database locked"
- Close all terminals and restart.

### Frontend shows blank page on Smartweb
- Did you upload the `.htaccess` file?
- Did you upload the *contents* of `dist` and not the folder itself?

### "Network Error" when logging in
- Your frontend cannot reach the backend.
- Check if your Railway URL is correct in the code.
- Check if the Railway project is running (green status).

---

## 💡 Need Help?

1. **Read the error**: It usually tells you exactly what's wrong.
2. **Check the steps**: Did you skip one?
3. **Google it**: Copy the error message into Google.

---

**Archmedics Hospital Management System**
