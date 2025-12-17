# Quick Start Guide - Archmedics HMS

## 🚀 Getting Started in 3 Steps

### Step 1: Setup Database
```bash
npm run migrate:latest
npm run seed:run
```

### Step 2: Start Application
```bash
npm run dev
```

### Step 3: Login
- **URL**: http://localhost:5173
- **Admin**: admin@archmedics.com / admin123
- **Doctor**: doctor@archmedics.com / doctor123
- **Nurse**: nurse@archmedics.com / nurse123

## 📋 Recently Implemented Features

### ✅ Ward Management (NEW!)
**Access**: Nurse → Ward Management

**What you can do**:
- View all wards and bed occupancy
- Admit patients to beds
- Discharge patients
- Manage bed status (Cleaning, Maintenance, etc.)

**Quick Test**:
1. Login as nurse@archmedics.com
2. Go to "Ward Management" in sidebar
3. Click on any ward to see beds
4. Click an available bed to admit a patient
5. Click an occupied bed to discharge

### ✅ Bulk Vital Signs Entry
**Access**: Nurse → Vital Signs

**Features**:
- Single entry mode with validation
- Bulk entry for multiple patients
- Abnormal value alerts (red highlights)

### ✅ Medication Administration Records (MAR)
**Access**: Nurse → Medications

**Features**:
- View due medications
- Record administration with barcode scanning
- Track missed/refused medications
- Administration history

### ✅ HMO & NHIS Management
**Access**: Admin → HMO Management

**Features**:
- Manage HMO providers
- NHIS service codes
- Claims processing
- Pre-authorization requests
- Referral management

## 🏥 Module Status

| Module | Completion | Key Features |
|--------|-----------|--------------|
| Admin | 90% | User management, HMO/NHIS, Settings |
| Doctor | 85% | Patient records, Prescriptions, Lab orders |
| Nurse | 80% | Wards, Vitals, Medications, MAR |
| Pharmacy | 70% | Dispensing, Stock management |
| Laboratory | 65% | Test orders, Results entry |
| Billing | 75% | Invoicing, Payments, HMO claims |

## 🔧 Common Commands

```bash
# Development
npm run dev                  # Start dev server (frontend + backend)
npm run build               # Build for production
npm run preview             # Preview production build

# Database
npm run migrate:latest      # Run migrations
npm run migrate:rollback    # Rollback last migration
npm run seed:run           # Seed database
npm run db:reset           # Reset and reseed database

# Type Checking
npm run type-check         # Check TypeScript types
npm run lint              # Run ESLint
```

## 📁 Project Structure

```
archmedics-hms-offline-main/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components by role
│   │   ├── admin/
│   │   ├── doctor/
│   │   ├── nurse/        # ← Ward Management here
│   │   ├── pharmacy/
│   │   └── lab/
│   ├── server/           # Backend API
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth, etc.
│   ├── services/         # API client services
│   └── types/           # TypeScript types
├── migrations/          # Database migrations
└── seeds/              # Database seed data
```

## 🎯 What to Test Next

1. **Ward Management Workflow**:
   - Admit a patient
   - Check bed occupancy updates
   - Discharge patient
   - Verify bed status changes

2. **Bulk Vitals Entry**:
   - Switch to bulk mode
   - Enter vitals for 3+ patients
   - Check validation for abnormal values

3. **MAR System**:
   - View due medications
   - Simulate barcode scan
   - Record administration

## 💡 Tips

- **Database Reset**: If you need fresh data, run `npm run db:reset`
- **Port Issues**: Backend runs on 3001, frontend on 5173
- **Login Issues**: Make sure migrations and seeds have run
- **Module Access**: Each user role sees different sidebar items

## 🐛 Troubleshooting

**Server won't start?**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001
# Kill the process if needed
taskkill /PID <process_id> /F
```

**Database errors?**
```bash
npm run db:reset
```

**Build errors?**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📞 Need Help?

Check these files for detailed documentation:
- `WARD_MANAGEMENT_IMPLEMENTATION.md` - Ward system details
- `SESSION_4_PROGRESS.md` - Latest session progress
- `IMPLEMENTATION_PROGRESS.md` - Overall progress
- `README.md` - Full project documentation
