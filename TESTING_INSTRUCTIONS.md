# Testing Instructions - Archmedics HMS

## 🚀 How to Run the Application

The application requires **TWO servers** to run:
1. **Backend API Server** (Express on port 3001)
2. **Frontend Dev Server** (Vite on port 8080)

### Method 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd "c:\Users\HP\Documents\Archmedics Hospital\archmedics-hms-offline-main"
npm run build:server
node dist/server/index.js
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\HP\Documents\Archmedics Hospital\archmedics-hms-offline-main"
npm run dev
```

### Method 2: Using concurrently (Future Enhancement)

Install concurrently:
```bash
npm install --save-dev concurrently
```

Add to package.json scripts:
```json
"dev:all": "concurrently \"npm run dev\" \"npm run build:server && node dist/server/index.js\""
```

Then run:
```bash
npm run dev:all
```

---

## 🔐 Login Credentials

After running `npm run db:reset`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@archmedics.com | admin123 |
| Doctor | dr.smith@archmedics.com | doctor123 |
| Doctor | dr.johnson@archmedics.com | doctor123 |
| **Nurse** | **nurse.williams@archmedics.com** | **nurse123** |
| EHR Manager | ehr@archmedics.com | ehr123 |
| Pharmacist | pharmacist@archmedics.com | pharm123 |
| Lab Tech | labtech@archmedics.com | lab123 |

⚠️ **Note**: The demo buttons on login page use `nurse@archmedics.com` which doesn't exist. Use `nurse.williams@archmedics.com` instead.

---

## 🏥 Testing Ward Management

### Prerequisites
1. Both servers running (see above)
2. Database seeded: `npm run db:reset`
3. Logged in as nurse or admin

### Test Steps

1. **Navigate to Ward Management**
   - Login as `nurse.williams@archmedics.com`
   - Click "Ward Management" in sidebar
   - URL: http://localhost:8080/nurse/wards

2. **View Wards List**
   - Should see 6 default wards
   - Check occupancy statistics
   - Verify capacity bars

3. **View Ward Details**
   - Click on any ward card
   - Should see bed layout grid
   - Beds color-coded by status:
     - 🟢 Green = Available
     - 🔴 Red = Occupied
     - 🟡 Yellow = Cleaning
     - ⚪ Gray = Maintenance

4. **Admit Patient**
   - Click on an Available bed
   - Click "Admit" button
   - Select patient from dropdown
   - Enter reason, diagnosis, notes
   - Submit
   - Verify bed turns red (Occupied)
   - Verify patient info appears on bed

5. **Discharge Patient**
   - Click on an Occupied bed
   - Click "Discharge" button
   - Select discharge type
   - Enter discharge notes
   - Submit
   - Verify bed turns yellow (Cleaning)
   - Verify patient info removed

6. **Update Bed Status**
   - Click on a Cleaning bed
   - Click "Mark Clean"
   - Verify bed turns green (Available)

---

## 🧪 Testing Other Nurse Features

### Bulk Vital Signs Entry
**URL**: http://localhost:8080/nurse/vitals

1. Switch to "Bulk Entry" mode
2. Enter vitals for multiple patients
3. Check for red highlights on abnormal values
4. Submit and verify

### Medication Administration Records (MAR)
**URL**: http://localhost:8080/nurse/medications

1. View due medications
2. Click "Administer" on a medication
3. Enter administration notes
4. Simulate barcode scan (enter medication ID)
5. Verify administration recorded

---

## 🔍 Troubleshooting

### "Invalid credentials" on login
- Make sure you're using the correct email from the table above
- Try `nurse.williams@archmedics.com` not `nurse@archmedics.com`
- Run `npm run db:reset` to reseed database

### "Failed to load wards" or blank page
- **Backend server not running** - Start it in separate terminal
- Check backend is on port 3001: `curl http://localhost:3001/health`
- Check browser console for errors (F12)

### "Something went wrong" error
- Backend server crashed or not started
- Check terminal for backend errors
- Restart backend server

### Page won't load / Network error
- Frontend not running - Run `npm run dev`
- Check port 8080 is not in use
- Clear browser cache and reload

### Database errors
```bash
# Reset database completely
npm run db:reset

# Or manually:
npm run migrate:rollback
npm run migrate:latest
npm run seed:run
```

---

## 📊 API Endpoints to Test

You can test backend directly with curl/Postman:

### Health Check
```bash
curl http://localhost:3001/health
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nurse.williams@archmedics.com\",\"password\":\"nurse123\"}"
```

### Get Wards (requires auth token)
```bash
curl http://localhost:3001/api/wards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Known Issues

1. **Demo Login Buttons**: Use wrong email (`nurse@archmedics.com` instead of `nurse.williams@archmedics.com`)
   - **Fix**: Update demo button in login page or update seed data

2. **Single Command Start**: Need to run two separate commands for frontend/backend
   - **Fix**: Add concurrently script (see Method 2 above)

3. **Backend ESM Warnings**: Module type warnings when running backend
   - **Fix**: Add `"type": "module"` to package.json (optional, doesn't affect functionality)

---

## ✅ Test Checklist

Before marking a feature as complete, verify:

- [ ] Backend server starts without errors
- [ ] Frontend builds and runs
- [ ] Can login with test credentials
- [ ] Can navigate to feature page
- [ ] All CRUD operations work
- [ ] Error handling works (try invalid inputs)
- [ ] UI updates reflect database changes
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Responsive on different screen sizes

---

## 🎯 Next Steps

After testing ward management:
1. Test bulk vital signs entry
2. Test medication administration
3. Move on to Pharmacy module enhancements
4. Implement Laboratory module features
