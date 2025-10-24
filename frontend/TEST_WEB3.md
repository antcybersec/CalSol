# CalendarFi Web3 Testing Guide

## ✅ Quick Start (5 Minutes)

### 1. Get Devnet SOL
```bash
# Option A: Using Solana CLI
solana airdrop 2 --url devnet

# Option B: Using Web Faucet
# Visit: https://faucet.solana.com
# Paste your wallet address and request SOL
```

### 2. Start Both Servers
```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend
cd calendefi-new
npm run dev
```

### 3. Open Dashboard
- Go to http://localhost:8080
- Click "Launch Dashboard"

### 4. Onboard Calendar
- Copy service account email
- Go to Google Calendar
- Add service account as collaborator
- Enter calendar ID in dashboard
- Click "Onboard Calendar"

### 5. Create Test Event
- Click "New Event"
- Title: `Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
- Date: Today
- Time: Now or 1 minute from now
- Click "Create Event"

### 6. Execute Transaction
- Click "Execute" button on the event
- Wait for transaction to complete
- Check status (should show "executed")
- Click signature link to view on Solana Explorer

---

## 🧪 Test Scenarios

### Scenario 1: Simple SOL Transfer
**Goal**: Send SOL to another wallet

**Steps**:
1. Create event: `Send 0.5 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
2. Execute immediately
3. Verify transaction on explorer

**Expected Result**: ✅ Transaction confirmed on Solana Devnet

---

### Scenario 2: Multiple Transfers
**Goal**: Send SOL to multiple wallets

**Steps**:
1. Create event 1: `Send 0.2 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
2. Create event 2: `Send 0.2 SOL to 11111111111111111111111111111111`
3. Create event 3: `Send 0.2 SOL to 22222222222222222222222222222222`
4. Execute all three
5. Verify all transactions

**Expected Result**: ✅ All three transactions confirmed

---

### Scenario 3: Scheduled Transaction
**Goal**: Schedule a transaction for future execution

**Steps**:
1. Create event: `Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
2. Set time to 5 minutes from now
3. Wait for automatic execution
4. Check status updates

**Expected Result**: ✅ Transaction executes automatically at scheduled time

---

### Scenario 4: Invalid Address
**Goal**: Test error handling

**Steps**:
1. Create event: `Send 0.1 SOL to invalid_address`
2. Try to execute
3. Check error message

**Expected Result**: ❌ Error: "Invalid address format"

---

### Scenario 5: Insufficient Balance
**Goal**: Test balance validation

**Steps**:
1. Create event: `Send 100 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X`
2. Try to execute
3. Check error message

**Expected Result**: ❌ Error: "Insufficient balance"

---

## 🔍 Debugging

### Check Backend Logs
```bash
# Terminal running backend
# Look for transaction execution logs
# Example output:
# ✅ Transaction executed: 5Zx...
# 📊 Signature: 5Zx...
```

### Check Frontend Console
```bash
# Open browser DevTools (F12)
# Go to Console tab
# Look for API calls and responses
```

### Test API Endpoints Directly
```bash
# Get wallet info
curl http://localhost:3001/api/wallet/test@gmail.com

# Get transaction status
curl http://localhost:3001/api/transaction/status/evt_123

# Health check
curl http://localhost:3001/api/health
```

### Check Solana Explorer
```
https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet
```

---

## 📊 Monitoring

### Real-time Monitoring
1. Open backend terminal
2. Watch for transaction logs
3. Check timestamps and signatures

### Transaction Tracking
1. Copy transaction signature from dashboard
2. Paste into Solana Explorer
3. View full transaction details
4. Check account balances

### Wallet Monitoring
```bash
# Check wallet balance
curl http://localhost:3001/api/wallet/your-calendar-id

# Response:
# {
#   "success": true,
#   "data": {
#     "address": "9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X",
#     "balance": "1.5234",
#     "explorerUrl": "https://explorer.solana.com/address/..."
#   }
# }
```

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid calendar ID format"
**Solution**: Calendar ID should be in format: `user@gmail.com` or `calendar-id@group.calendar.google.com`

### Issue: "Transaction failed: Insufficient balance"
**Solution**: Request more SOL from faucet or use smaller amount

### Issue: "Invalid address format"
**Solution**: Use valid Solana address (44 characters, base58 encoded)

### Issue: "Backend not responding"
**Solution**: 
1. Check backend is running: `node server.js`
2. Check port 3001 is not in use
3. Restart backend

### Issue: "Calendar not syncing"
**Solution**:
1. Verify service account has access
2. Check calendar ID is correct
3. Restart backend agent

---

## ✨ Success Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 8080
- [ ] Calendar onboarded successfully
- [ ] Wallet has devnet SOL
- [ ] First transaction executed
- [ ] Transaction visible on Solana Explorer
- [ ] Multiple transactions working
- [ ] Error handling working

---

## 🎓 Learning Resources

### Solana Documentation
- https://docs.solana.com
- https://solana.com/developers

### Web3.js Documentation
- https://solana-labs.github.io/solana-web3.js/

### Solana Explorer
- https://explorer.solana.com (Mainnet)
- https://explorer.solana.com?cluster=devnet (Devnet)

### CalendarFi Reference
- https://github.com/fabianferno/calendefi

---

## 📝 Notes

- All transactions are on **Solana Devnet** (testnet)
- Devnet SOL has no real value
- Transactions are free (minimal network fees)
- Perfect for testing and learning

---

## 🎉 Next Steps

Once testing is complete:
1. Review WEB3_INTEGRATION.md for full documentation
2. Explore advanced features
3. Deploy to production (when ready)
4. Integrate with real applications

Happy testing! 🚀

