# 🎯 Step-by-Step Testing Guide - Calendar Integration & Web3

## ⏱️ Total Time: ~15 minutes

---

## 📋 Prerequisites (Before You Start)

### Check 1: Both Servers Running
```bash
# Terminal 1: Backend
cd /Users/anantkumar/Desktop/earn/backend
node server.js

# Terminal 2: Frontend
cd /Users/anantkumar/Desktop/earn/calendefi-new
npm run dev
```

**Expected Output:**
- Backend: `🚀 CalendarFi Backend running on http://localhost:3001`
- Frontend: `➜  Local:   http://localhost:8080/`

### Check 2: Get Devnet SOL
```bash
# Get 2 SOL for testing
solana airdrop 2 --url devnet
```

**Expected Output:**
```
Requesting airdrop of 2 SOL
Signature: 5Zx...
```

---

## 🚀 STEP 1: Open Dashboard (1 minute)

### 1.1 Open Browser
- Go to: **http://localhost:8080**
- You should see the CalendarFi landing page

### 1.2 Click "Launch Dashboard"
- Look for the blue button at the bottom of the hero section
- Click it
- You'll be redirected to `/dashboard`

### 1.3 Verify Dashboard Loaded
- You should see:
  - ✅ "CalendarFi Dashboard" heading
  - ✅ "New Event" button (top right)
  - ✅ Google Calendar onboarding section (3 steps)

---

## 📋 STEP 2: Copy Service Account Email (2 minutes)

### 2.1 Find the Email
- Look for the first card: "Copy Service Account Email"
- You'll see a text field with: `calendefi-agent@coders-connect-450316.iam.gserviceaccount.com`

### 2.2 Copy to Clipboard
- Click the "Copy" button next to the email
- You should see: "Copied" confirmation

### 2.3 Verify Copy
- Open a text editor (Notes, TextEdit, etc.)
- Paste the email
- Verify it's: `calendefi-agent@coders-connect-450316.iam.gserviceaccount.com`

---

## 🗓️ STEP 3: Add Service Account to Google Calendar (3 minutes)

### 3.1 Open Google Calendar
- Go to: **https://calendar.google.com**
- Sign in with your Google account

### 3.2 Create or Select Calendar
- On the left sidebar, find "My calendars"
- Either use existing calendar or create new one
- Click the 3-dot menu next to calendar name
- Select "Settings"

### 3.3 Add Service Account as Collaborator
- In Settings, go to "Share with specific people"
- Click "Add people"
- Paste the service account email: `calendefi-agent@coders-connect-450316.iam.gserviceaccount.com`
- Set permission to: **"Make changes to events"**
- Click "Send"

### 3.4 Get Your Calendar ID
- Still in Settings, scroll down to "Integrate calendar"
- Look for "Calendar ID"
- It should look like: `your-email@gmail.com` or `your-email@group.calendar.google.com`
- Copy this ID

### 3.5 Verify
- You should have copied:
  - ✅ Service account email
  - ✅ Your calendar ID

---

## 🔗 STEP 4: Onboard Calendar in Dashboard (2 minutes)

### 4.1 Go Back to Dashboard
- Return to: **http://localhost:8080/dashboard**

### 4.2 Find Onboarding Section
- Look for the second card: "Onboard Your Calendar"
- You'll see an input field for "Calendar ID"

### 4.3 Enter Calendar ID
- Click the input field
- Paste your calendar ID (from Step 3.4)
- Example: `your-email@gmail.com`

### 4.4 Click "Onboard" Button
- Click the blue "Onboard" button
- Wait for response (should be instant)

### 4.5 Verify Success
- You should see:
  - ✅ Green success message: "Calendar onboarded successfully!"
  - ✅ Onboarding section disappears
  - ✅ New "Wallet Info" card appears showing your calendar ID

---

## 💰 STEP 5: Create Your First Transaction Event (3 minutes)

### 5.1 Click "New Event" Button
- Top right of dashboard
- A dialog box will open

### 5.2 Fill Event Details
```
Title: Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X
Description: Test transaction
Date: Today (or any date)
Time: Now or 1 minute from now
```

**Important**: The title format MUST be:
- `Send [AMOUNT] SOL to [ADDRESS]`

### 5.3 Click "Create Event"
- The dialog closes
- You should see the event appear in the dashboard
- Status should be: **"pending"** (yellow)

### 5.4 Verify Event Created
- Event appears in the list
- Shows:
  - ✅ Title: "Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X"
  - ✅ Status: "pending" (yellow badge)
  - ✅ "Execute" button (blue)
  - ✅ "Delete" button (red)

---

## ⚡ STEP 6: Execute Transaction (2 minutes)

### 6.1 Click "Execute" Button
- Find your event in the list
- Click the blue "Execute" button
- Wait for processing (5-10 seconds)

### 6.2 Watch Status Change
- Status changes: pending → executing → executed
- You should see:
  - ✅ Status badge turns green: "executed"
  - ✅ Transaction signature appears (long string)
  - ✅ "View on Explorer" link appears

### 6.3 Check Backend Logs
- Look at Terminal 1 (backend)
- You should see logs like:
```
✅ Transaction executed: 5Zx...
📊 Signature: 5Zx...
```

### 6.4 Verify on Solana Explorer
- Click the signature link or copy it
- Go to: **https://explorer.solana.com?cluster=devnet**
- Paste signature in search box
- You should see:
  - ✅ Transaction confirmed
  - ✅ From address (your wallet)
  - ✅ To address (recipient)
  - ✅ Amount: 0.1 SOL
  - ✅ Status: "Success"

---

## 🧪 STEP 7: Test Multiple Transactions (3 minutes)

### 7.1 Create Second Event
```
Title: Send 0.05 SOL to 11111111111111111111111111111111
Date: Today
Time: Now
```

### 7.2 Create Third Event
```
Title: Send 0.05 SOL to 22222222222222222222222222222222
Date: Today
Time: Now
```

### 7.3 Execute Both
- Click "Execute" on second event
- Wait for completion
- Click "Execute" on third event
- Wait for completion

### 7.4 Verify All Three
- All three events should show:
  - ✅ Status: "executed" (green)
  - ✅ Signatures displayed
  - ✅ All visible on Solana Explorer

---

## 🔍 STEP 8: Verify in Google Calendar (2 minutes)

### 8.1 Go Back to Google Calendar
- Open: **https://calendar.google.com**

### 8.2 Check Events
- You should see your calendar events
- Click on one of the transaction events
- In the description, you should see:
  - ✅ Transaction signature
  - ✅ Status: "executed"
  - ✅ Timestamp

### 8.3 Verify Sync
- Events created in dashboard appear in Google Calendar
- Status updates appear in event description

---

## ✅ STEP 9: Test Error Handling (2 minutes)

### 9.1 Create Invalid Event
```
Title: Send 100 SOL to invalid_address
Date: Today
Time: Now
```

### 9.2 Try to Execute
- Click "Execute"
- You should see:
  - ✅ Status changes to "failed" (red)
  - ✅ Error message displayed
  - ✅ Backend logs show error

### 9.3 Create Insufficient Balance Event
```
Title: Send 1000 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X
Date: Today
Time: Now
```

### 9.4 Try to Execute
- Click "Execute"
- You should see:
  - ✅ Status: "failed" (red)
  - ✅ Error: "Insufficient balance"

---

## 🎯 STEP 10: Test Dark Mode (1 minute)

### 10.1 Toggle Dark Mode
- Look at header (top right)
- Click the sun/moon icon
- Theme should switch instantly

### 10.2 Verify
- ✅ Light mode works
- ✅ Dark mode works
- ✅ All elements visible in both modes

---

## 📊 STEP 11: Monitor Backend (Optional)

### 11.1 Check Backend Logs
- Look at Terminal 1 (backend running)
- You should see logs for each transaction:
```
✅ Transaction executed: 5Zx...
📊 Signature: 5Zx...
💰 Amount: 0.1 SOL
📍 To: 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X
```

### 11.2 Check API Directly
```bash
# Get wallet info
curl http://localhost:3001/api/wallet/your-calendar-id

# Get transaction status
curl http://localhost:3001/api/transaction/status/evt_123

# Health check
curl http://localhost:3001/api/health
```

---

## 🎉 STEP 12: Final Verification Checklist

- [ ] Dashboard loads at http://localhost:8080/dashboard
- [ ] Service account email copied successfully
- [ ] Calendar onboarded successfully
- [ ] First transaction created
- [ ] First transaction executed
- [ ] Transaction visible on Solana Explorer
- [ ] Multiple transactions work
- [ ] Error handling works
- [ ] Dark mode works
- [ ] Events sync to Google Calendar
- [ ] Backend logs show transactions
- [ ] API endpoints respond correctly

---

## 🚨 Troubleshooting

### Issue: "Calendar onboarding failed"
**Solution:**
1. Verify calendar ID format (should be email-like)
2. Check service account was added to calendar
3. Check permissions are set to "Make changes to events"
4. Restart backend: `node server.js`

### Issue: "Transaction failed: Invalid address"
**Solution:**
1. Use valid Solana address (44 characters)
2. Or use test address: `9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
3. Check title format: `Send X SOL to ADDRESS`

### Issue: "Insufficient balance"
**Solution:**
1. Request more devnet SOL: `solana airdrop 2 --url devnet`
2. Use smaller amount (0.1 SOL instead of 1 SOL)
3. Check wallet balance: `curl http://localhost:3001/api/wallet/your-calendar-id`

### Issue: "Backend not responding"
**Solution:**
1. Check backend is running: `node server.js`
2. Check port 3001 is free: `lsof -i :3001`
3. Restart backend

### Issue: "Frontend not loading"
**Solution:**
1. Check frontend is running: `npm run dev`
2. Check port 8080 is free: `lsof -i :8080`
3. Restart frontend

---

## 📝 Notes

- All transactions are on **Solana Devnet** (testnet)
- Devnet SOL has no real value
- Transactions are free (minimal network fees)
- Perfect for testing and learning
- Each calendar gets a unique wallet
- Wallets are deterministic (same calendar = same wallet)

---

## 🎓 What You've Learned

✅ How to onboard a Google Calendar
✅ How to create transaction events
✅ How to execute blockchain transactions
✅ How to track transaction status
✅ How to verify on Solana Explorer
✅ How to handle errors
✅ How the Web3 integration works

---

## 🚀 Next Steps

1. **Explore more features** - Try different transaction amounts
2. **Test scheduled transactions** - Create events for future times
3. **Monitor transactions** - Check Solana Explorer
4. **Read documentation** - Check WEB3_INTEGRATION.md
5. **Deploy to production** - When ready

---

**Congratulations! You've successfully tested the CalendarFi Web3 integration! 🎉**

