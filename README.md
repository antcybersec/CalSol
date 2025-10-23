# CalendarFi - Your Calendar is Now a Wallet

CalendarFi bridges Web2 calendars with Web3 by turning your Google Calendar into a blockchain wallet. Schedule crypto payments, token-gated events, and on-chain transactions as easily as scheduling meetings.

## 🎯 Key Features

- **Token-Gated Calendar Access**: Restrict calendar events to holders of specific NFTs or tokens
- **Subscription Model**: Schedule recurring crypto payments tied to calendar events
- **Crypto-Native Scheduling**: Trigger on-chain actions from calendar events
- **Solana Actions & Blinks**: Seamless transaction signing from calendar UI
- **Google Calendar Integration**: OAuth-based calendar access and event management

## 🏗️ Architecture

### Project Structure

```
calendarfi/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and service integrations
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx
│   └── package.json
├── programs/                 # Solana programs (smart contracts)
│   ├── calendarfi/          # Main CalendarFi program
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── instructions/
│   │   │   ├── state/
│   │   │   └── errors.rs
│   │   └── Cargo.toml
│   └── Anchor.toml
├── tests/                    # Integration tests
├── docs/                     # Documentation
└── package.json             # Root package.json

```

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Solana Wallet Adapter for wallet integration
- Google Calendar API for calendar access
- TailwindCSS for styling

**Blockchain:**
- Solana (devnet for testing)
- Anchor framework for program development
- Clockwork for transaction scheduling
- Solana Actions & Blinks for UX

**Backend Services:**
- Google OAuth 2.0 for authentication
- Solana RPC for blockchain interaction

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd calendarfi

# Install dependencies
npm install

# Install Solana CLI (if not already installed)
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## 📋 Development Roadmap

1. **Phase 1**: Project setup and architecture
2. **Phase 2**: Frontend initialization with wallet and calendar integration
3. **Phase 3**: Solana program development
4. **Phase 4**: Clockwork integration for scheduling
5. **Phase 5**: Token gating implementation
6. **Phase 6**: Solana Actions & Blinks integration
7. **Phase 7**: Testing and deployment

## 🔗 Key Resources

- [Solana Documentation](https://docs.solana.com)
- [Anchor Framework](https://www.anchor-lang.com)
- [Google Calendar API](https://developers.google.com/calendar)
- [Clockwork Scheduler](https://docs.clockwork.xyz)
- [Solana Actions & Blinks](https://solana.com/docs/advanced/actions)

## 📝 License

MIT

