# CalendarFi Web3 Integration Guide

## 🎯 How It Works

CalendarFi uses your Google Calendar to schedule and execute blockchain transactions on Solana Devnet. Here's the complete flow:

### 1. **Onboard Your Calendar**
- Copy the service account email: `calendefi-agent@coders-connect-450316.iam.gserviceaccount.com`
- Go to Google Calendar settings
- Add the service account as a collaborator with "Make changes to events" permission
- Enter your calendar ID in the dashboard
- Click "Onboard Calendar"

### 2. **Create Transaction Events**
- Create a new calendar event with a transaction title
- Supported formats:
  - **Transfer**: "Send 5 SOL to wallet_address"
  - **Transfer with ENS**: "Send 5 SOL to vitalik.eth"
  - **Swap**: "Swap 10 USDC to SOL" (coming soon)

### 3. **Automatic Execution**
- The backend agent monitors your calendar every 5 seconds
- When an event time arrives, it automatically executes the transaction
- Transaction status is updated in the event description
- You can view the transaction on Solana Explorer

---

## 🔧 Technical Architecture

### Frontend (React + TypeScript)
```
calendefi-new/
├── src/
│   ├── pages/Dashboard.tsx          # Main calendar interface
│   ├── components/Header.tsx        # Wallet connection
│   └── services/solanaService.ts    # Blockchain utilities
```

**Key Features:**
- Google Calendar onboarding UI
- Event creation and management
- Real-time transaction status
- Dark mode support

### Backend (Express.js + Solana Web3.js)
```
backend/
├── server.js                        # Main server with all endpoints
```

**Key Endpoints:**
- `POST /api/calendar/onboard` - Onboard a calendar
- `POST /api/transaction/execute` - Execute a transaction
- `GET /api/wallet/:calendarId` - Get wallet info
- `GET /api/transaction/status/:eventId` - Get transaction status

---

## 💰 Wallet Generation

Each calendar gets a **deterministic wallet** generated from its ID:

```javascript
// Wallet is generated from calendar ID hash
const hash = crypto.createHash('sha256').update(calendarId).digest()
const keypair = Keypair.fromSecretKey(hash)
```

**Benefits:**
- Same calendar always gets the same wallet
- No private key storage needed
- Deterministic and reproducible

---

## 🚀 Transaction Execution Flow

### Step 1: Parse Event Title
```
Event Title: "Send 5 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X"
↓
Parsed: { type: 'transfer', amount: 5, token: 'SOL', recipient: '9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X' }
```

### Step 2: Create Transaction
```javascript
const transaction = new Transaction({
  recentBlockhash: blockhash,
  feePayer: fromKeypair.publicKey,
}).add(
  SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: toPublicKey,
    lamports: amount * LAMPORTS_PER_SOL,
  })
)
```

### Step 3: Sign & Send
```javascript
const signature = await connection.sendTransaction(transaction, [fromKeypair])
await connection.confirmTransaction(signature)
```

### Step 4: Update Calendar
- Event description updated with transaction signature
- Status changed to "executed"
- Explorer link provided

---

## 📝 Example Transaction Formats

### SOL Transfer
```
Event Title: "Send 5 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X"
Time: 2024-10-23 14:30 UTC
```

### Multiple Transfers
```
Event 1: "Send 2 SOL to alice.eth"
Event 2: "Send 3 SOL to bob.eth"
Event 3: "Send 1 SOL to charlie.eth"
```

### Scheduled Transactions
- Create events for future dates
- Agent will execute them automatically at scheduled time
- Perfect for recurring payments or DCA strategies

---

## 🔐 Security Considerations

### Current Implementation (Devnet)
- Wallets generated from calendar ID (deterministic)
- No private keys stored in database
- Transactions signed locally on backend
- Devnet only (testnet SOL)

### Production Recommendations
1. **Use Hardware Wallets** - Integrate with Ledger/Trezor
2. **Multi-Sig** - Require multiple approvals for transactions
3. **Rate Limiting** - Prevent spam transactions
4. **Audit Logging** - Track all transactions
5. **Encryption** - Encrypt sensitive data at rest

---

## 🧪 Testing

### Get Devnet SOL
```bash
# Use Solana CLI
solana airdrop 2 <your-wallet-address> --url devnet

# Or use faucet: https://faucet.solana.com
```

### Test Transaction
1. Go to Dashboard
2. Onboard your calendar
3. Create event: "Send 0.1 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X"
4. Wait for execution
5. Check Solana Explorer

### Monitor Backend
```bash
# Check wallet info
curl http://localhost:3001/api/wallet/your-calendar-id

# Check transaction status
curl http://localhost:3001/api/transaction/status/event-id

# Health check
curl http://localhost:3001/api/health
```

---

## 🚀 Next Steps

### Phase 1: Core Features (Current)
- ✅ SOL transfers
- ✅ Calendar integration
- ✅ Devnet support

### Phase 2: Enhanced Features
- [ ] Token swaps (Uniswap V3)
- [ ] ERC-20 token transfers
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Recurring transactions

### Phase 3: Advanced Features
- [ ] Smart contract interactions
- [ ] Multi-sig wallets
- [ ] Governance voting
- [ ] DeFi strategies

### Phase 4: Production
- [ ] Mainnet support
- [ ] Hardware wallet integration
- [ ] Professional audit
- [ ] Insurance coverage

---

## 📚 API Reference

### Onboard Calendar
```bash
POST /api/calendar/onboard
{
  "calendarId": "user@gmail.com"
}
```

### Execute Transaction
```bash
POST /api/transaction/execute
{
  "eventId": "evt_123",
  "calendarId": "user@gmail.com",
  "eventTitle": "Send 5 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X"
}
```

### Get Wallet Info
```bash
GET /api/wallet/:calendarId
```

### Get Transaction Status
```bash
GET /api/transaction/status/:eventId
```

---

## 🐛 Troubleshooting

### Transaction Failed
- Check wallet has enough SOL
- Verify recipient address format
- Check Solana network status
- Review backend logs

### Calendar Not Syncing
- Verify calendar ID is correct
- Check service account has access
- Restart backend agent
- Check network connectivity

### Wallet Not Found
- Ensure calendar is onboarded
- Check calendar ID format
- Verify backend is running

---

## 📞 Support

For issues or questions:
1. Check the logs: `npm run dev` (frontend) and `node server.js` (backend)
2. Review this guide
3. Check Solana documentation: https://docs.solana.com
4. Open an issue on GitHub

---

## 📄 License

MIT License - See LICENSE file for details

