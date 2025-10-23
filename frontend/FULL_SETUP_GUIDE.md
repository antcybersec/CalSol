# 🚀 CalendarFi - Complete Setup & Testing Guide

## 📋 Overview

This guide will help you set up CalendarFi with **real Google Calendar integration** and **Solana blockchain transactions**.

**Total Setup Time: ~30 minutes**

---

## 🎯 What You'll Have After Setup

✅ Real Google Calendar connected to CalendarFi
✅ Ability to create events in your calendar from the app
✅ Automatic transaction execution from calendar events
✅ Real Solana Devnet transactions
✅ Transaction status updates in Google Calendar

---

## 📝 PHASE 1: Google Calendar Setup (15 minutes)

### Follow the guide: `GOOGLE_CALENDAR_SETUP.md`

**Key steps:**
1. Create Google Cloud Project
2. Enable Calendar API
3. Create Service Account
4. Download JSON key → save to `backend/service-account-key.json`
5. Create Google Calendar
6. Share calendar with service account
7. Update `.env` with calendar ID

**After this phase, you should have:**
- ✅ `backend/service-account-key.json` file
- ✅ Calendar ID in `backend/.env`
- ✅ Google Calendar shared with service account

---

## 💻 PHASE 2: Backend Setup (5 minutes)

### 2.1 Install Dependencies
```bash
cd /Users/anantkumar/Desktop/earn/backend
npm install googleapis google-auth-library
```

### 2.2 Verify .env File
```bash
cat /Users/anantkumar/Desktop/earn/backend/.env
```

Should contain:
```env
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
```

### 2.3 Verify Service Account Key
```bash
ls -la /Users/anantkumar/Desktop/earn/backend/service-account-key.json
```

Should show the file exists.

### 2.4 Start Backend
```bash
cd /Users/anantkumar/Desktop/earn/backend
node server.js
```

**Expected output:**
```
✅ Google Calendar API initialized
🚀 CalendarFi Backend running on http://localhost:3001
```

---

## 🎨 PHASE 3: Frontend Setup (5 minutes)

### 3.1 Start Frontend
```bash
cd /Users/anantkumar/Desktop/earn/calendefi-new
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:8080/
```

### 3.2 Open Dashboard
- Go to: http://localhost:8080/dashboard

---

## 🧪 PHASE 4: Testing (5 minutes)

### 4.1 Get Devnet SOL
```bash
solana airdrop 2 --url devnet
```

### 4.2 Onboard Calendar
1. Copy service account email (button in dashboard)
2. Enter your calendar ID
3. Click "Onboard"
4. You should see: "Calendar onboarded successfully!"

### 4.3 Create Event
1. Click "New Event" button
2. Fill in:
   ```
   Title: Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X
   Description: Test transaction
   Date: Today
   Time: Now
   ```
3. Click "Create Event"
4. Event appears in dashboard

### 4.4 Execute Transaction
1. Click "Execute" button on the event
2. Wait 5-10 seconds
3. Status changes to "executed" (green)
4. Signature appears

### 4.5 Verify in Google Calendar
1. Go to https://calendar.google.com
2. Open your "CalendarFi Transactions" calendar
3. Click on the event
4. You should see:
   - Transaction signature
   - Status: executed
   - Solana Explorer link

### 4.6 Verify on Solana Explorer
1. Click the signature link or go to: https://explorer.solana.com?cluster=devnet
2. Paste the signature
3. You should see:
   - Transaction confirmed
   - From address (your wallet)
   - To address (recipient)
   - Amount: 0.1 SOL

---

## 🔍 Verification Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 8080
- [ ] Google Calendar API initialized (check backend logs)
- [ ] service-account-key.json exists in backend folder
- [ ] Calendar ID in .env file
- [ ] Dashboard loads at http://localhost:8080/dashboard
- [ ] Can copy service account email
- [ ] Can onboard calendar
- [ ] Can create events
- [ ] Can execute transactions
- [ ] Events appear in Google Calendar
- [ ] Transactions appear on Solana Explorer

---

## 🚨 Troubleshooting

### Issue: "Google Calendar API initialized" not showing
**Solution:**
1. Check service-account-key.json exists: `ls -la backend/service-account-key.json`
2. Check file is valid JSON: `cat backend/service-account-key.json | head -5`
3. Restart backend: `node server.js`

### Issue: "Cannot access calendar" error
**Solution:**
1. Verify service account was added to calendar
2. Check permission is "Make changes to events"
3. Wait 1-2 minutes for permissions to propagate
4. Try onboarding again

### Issue: "Failed to create calendar event"
**Solution:**
1. Check calendar is onboarded
2. Check calendar ID is correct
3. Check backend is running
4. Check browser console for errors

### Issue: "Insufficient balance"
**Solution:**
1. Get more devnet SOL: `solana airdrop 2 --url devnet`
2. Use smaller amount (0.01 SOL instead of 0.1)

### Issue: Transaction not appearing in Google Calendar
**Solution:**
1. Refresh Google Calendar (F5)
2. Check calendar ID is correct
3. Check backend logs for errors
4. Verify service account has write permission

---

## 📊 API Endpoints

### Calendar Endpoints
```
GET  /api/calendar/events?calendarId=...
POST /api/calendar/create-event
POST /api/calendar/onboard
GET  /api/calendar/service-account
```

### Transaction Endpoints
```
POST /api/transaction/execute
GET  /api/transaction/status/:eventId
GET  /api/wallet/:calendarId
```

### Health Check
```
GET  /api/health
```

---

## 📚 Documentation Files

1. **GOOGLE_CALENDAR_SETUP.md** - Google Calendar configuration
2. **FULL_SETUP_GUIDE.md** - This file
3. **STEP_BY_STEP_TESTING.md** - Detailed testing guide
4. **WEB3_INTEGRATION.md** - Technical documentation
5. **QUICK_REFERENCE.md** - Quick lookup

---

## 🎉 Success!

If you've completed all steps and verified the checklist, you now have:

✅ CalendarFi fully functional
✅ Real Google Calendar integration
✅ Real Solana transactions
✅ Automatic status updates
✅ Production-ready setup

---

## 🚀 Next Steps

1. **Explore Features**
   - Create multiple events
   - Test different amounts
   - Try scheduled transactions

2. **Monitor Transactions**
   - Check Solana Explorer
   - Verify Google Calendar updates
   - Review backend logs

3. **Customize**
   - Change calendar name
   - Add more transaction types
   - Implement token swaps

4. **Deploy**
   - When ready, deploy to production
   - Switch to Solana Mainnet
   - Set up database instead of in-memory storage

---

## 💡 Tips

- Use small amounts (0.01-0.1 SOL) for testing
- Check backend logs for debugging
- Refresh Google Calendar to see updates
- Use Solana Explorer to verify transactions
- Keep service-account-key.json safe

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review backend logs
3. Check browser console
4. Verify all prerequisites are met
5. Restart both servers

---

**You're all set! Start testing CalendarFi now! 🎉**

