# CalendarFi - Solana Calendar Wallet

A calendar-based finance application that turns your calendar events into blockchain transactions on Solana.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Phantom Wallet (for Solana integration)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Backend Setup

The backend is located in `/backend` directory:

```bash
cd ../backend
npm install
node server.js
```

Backend runs on `http://localhost:3001`

## 🎯 Features

### ✅ Implemented
- **Dark Mode Toggle** - Switch between light and dark themes
- **Wallet Connection** - Connect Phantom wallet to Solana Devnet
- **Calendar Dashboard** - Create and manage calendar events
- **Event Execution** - Execute transactions scheduled in calendar
- **Transaction Status** - Track pending, executed, and failed transactions
- **Responsive Design** - Works on desktop and mobile

### 🔄 Event Types

Create events with these formats:

1. **Transfer**: "Send 5 SOL to wallet_address"
2. **Swap**: "Swap 10 USDC to SOL"

## 🛠️ Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn/ui for components
- Solana Web3.js for blockchain

### Backend Stack
- Express.js
- Solana Web3.js
- In-memory storage (can be replaced with database)

### Smart Contracts
- Anchor framework (Rust)
- Scheduled payment program template included

## 📁 Project Structure

```
calendefi-new/
├── src/
│   ├── components/
│   │   ├── Header.tsx (with wallet connection)
│   │   ├── Hero.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Index.tsx (landing page)
│   │   ├── Dashboard.tsx (calendar app)
│   │   └── NotFound.tsx
│   ├── services/
│   │   └── solanaService.ts (blockchain integration)
│   ├── App.tsx
│   └── main.tsx
├── .env (environment variables)
└── package.json

backend/
├── server.js (Express server)
├── package.json
└── .env
```

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

## 🌐 Wallet Connection

1. Install Phantom wallet extension
2. Create or import a Solana wallet
3. Switch to Devnet network
4. Click "Connect Wallet" button in header
5. Approve connection in Phantom popup

## 📝 Creating Events

1. Click "New Event" button in dashboard
2. Fill in event details:
   - **Title**: Transaction description (e.g., "Send 5 SOL to wallet")
   - **Description**: Optional details
   - **Date**: When to execute
   - **Time**: Execution time
3. Click "Create Event"
4. Event appears in dashboard with "pending" status

## ⚡ Executing Transactions

1. Click "Execute" button on pending event
2. Transaction is sent to backend
3. Status changes to "executed" with signature
4. View transaction on Solana Explorer

## 🎨 Theming

- **Light Mode**: Default theme
- **Dark Mode**: Click sun/moon icon in header
- Uses `next-themes` for persistence

## 🔗 API Endpoints

### Calendar
- `POST /api/calendar/verify` - Verify calendar
- `GET /api/calendar/events` - Get calendar events
- `POST /api/calendar/create-event` - Create event

### Transactions
- `POST /api/transaction/execute` - Execute transaction
- `GET /api/transaction/status/:eventId` - Get transaction status

### Health
- `GET /api/health` - Health check

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Heroku)
```bash
# Push to git and deploy
```

## 📚 Next Steps

1. **Deploy Smart Contracts**
   - Build: `anchor build`
   - Deploy: `anchor deploy --provider.cluster devnet`

2. **Add Database**
   - Replace in-memory storage with PostgreSQL
   - Add user authentication

3. **Google Calendar Integration**
   - Implement OAuth flow
   - Sync events bidirectionally

4. **Production Deployment**
   - Switch to Solana Mainnet
   - Add proper error handling
   - Implement rate limiting

## 🤝 Support

For issues or questions, check the GitHub repository or contact the team.

## 📄 License

MIT License - See LICENSE file for details

