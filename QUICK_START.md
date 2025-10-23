# 🚀 CalendarFi - Quick Start Guide

## ⚡ 30-Second Setup

### Terminal 1 - Backend
```bash
cd /Users/anantkumar/Desktop/earn/backend
node server.js
```
✅ Backend running on http://localhost:3001

### Terminal 2 - Frontend
```bash
cd /Users/anantkumar/Desktop/earn/frontend
npm run dev
```
✅ Frontend running on http://localhost:5175

---

## 🎯 What You Get

✅ **Full Blockchain Integration**
- Solana wallet connection (Phantom/Solflare)
- Real transaction execution
- Event-based payments
- Devnet support

✅ **Beautiful UI**
- CalendarFi-inspired design
- Yellow calendar grid
- Event management
- Toast notifications

✅ **12 Working Buttons**
- Wallet connection
- Event creation
- Transaction execution
- Calendar navigation
- And more!

✅ **Backend API**
- Calendar endpoints
- Transaction API
- Health check
- CORS enabled

---

## 🔗 How to Use

### 1. Connect Wallet
1. Install Phantom or Solflare wallet
2. Click "Connect Wallet" button
3. Approve in wallet popup
4. Button turns green ✓

### 2. Create Event
1. Click "New Event" button
2. Fill in event details
3. Format: "Send 5 SOL to <address>"
4. Click Save

### 3. Execute Transaction
1. Click "Execute" on event card
2. Approve in wallet
3. Transaction sent to Solana
4. Signature shown in toast

---

## 📊 API Endpoints

```
GET  /api/health
POST /api/calendar/verify
GET  /api/calendar/events
POST /api/calendar/create-event
POST /api/transaction/execute
GET  /api/transaction/status/:eventId
```

---

## 🧪 Quick Test

### Test Backend
```bash
curl http://localhost:3001/api/health
```

### Test Frontend
Open http://localhost:5175 in browser

### Test Wallet Connection
1. Click "Connect Wallet"
2. Approve in Phantom/Solflare
3. Button should turn green

---

## 📁 Key Files

**Frontend:**
- `src/App.tsx` - Main app
- `src/services/solanaService.ts` - Blockchain
- `src/services/apiService.ts` - API calls

**Backend:**
- `server.js` - Express server

**Smart Contracts:**
- `programs/scheduled_payment.rs` - Anchor program

---

## 🎓 Documentation

- `SETUP_GUIDE.md` - Detailed setup
- `BLOCKCHAIN_INTEGRATION.md` - Blockchain features
- `IMPLEMENTATION_COMPLETE.md` - Full status

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :3001

# Kill process
kill -9 <PID>

# Restart
node server.js
```

### Frontend won't connect to backend
- Verify backend is running
- Check REACT_APP_API_URL in .env.local
- Check browser console

### Wallet won't connect
- Install Phantom/Solflare
- Ensure devnet is selected
- Refresh page

---

## 🎉 You're All Set!

Your CalendarFi Solana app is ready to go! 🚀

Frontend:  http://localhost:5175
Backend:   http://localhost:3001

Happy coding! 💻

