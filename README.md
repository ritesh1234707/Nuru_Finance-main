<h1 align="center">🌐 Nuru Finance</h1>
<h3 align="center">Decentralized Savings, Lending & Investing on the Internet Computer</h3>

<p align="center">
  <img src="https://img.shields.io/badge/ICP-powered-blueviolet?style=flat-square" alt="Internet Computer">
  <img src="https://img.shields.io/badge/Motoko-smart%20contracts-orange?style=flat-square" alt="Motoko">
  <img src="https://img.shields.io/badge/React-18.2+-brightgreen?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.1+-blue?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-styling-0ea5e9?style=flat-square" alt="Tailwind">
</p>

---

## 💡 Overview

**Nuru Finance** is a next-gen decentralized application that enables individuals and groups to **save, lend, and invest Bitcoin** directly on the Internet Computer Protocol (ICP). It combines blockchain-based finance with multisig logic, KYC, DAO governance, and Bitcoin-native smart contracts — all wrapped in a modern, responsive UI.

---

## ✨ Features

- 💰 **Solo & Group Savings** with multisig pooling
- ₿ **Bitcoin DeFi** using ckBTC for true BTC utility
- 📈 **Dynamic APYs** from 4.5% up to 15%+ via staking, lending & HODLing
- 🛂 **Modular KYC** via HTTPS outcalls
- 🗳️ **Governance & DAO** with token-weighted voting
- 🌍 **Multi-Currency Ready**: roadmap includes fiat ramps and stablecoins
- 🔐 **Internet Identity** for secure and decentralized authentication
- 🎨 **Modern UI** built with React, Tailwind CSS, and Radix UI

---

## 🏗 Architecture

nuru_finance/
├── nuru_backend/ # Main Motoko logic
│ ├── main.mo # User accounts & savings logic
│ ├── bitcoin.mo # ckBTC and wallet management
│ ├── governancekyc.mo # DAO and KYC verification
│ └── yieldmanager.mo # Yield farming and reward logic
└── nuru_frontend/ # TypeScript + React app
├── components/ # Reusable UI
├── contexts/ # State management
├── pages/ # App routes & screens
├── lib/ # Utility modules
└── public/ # Static assets

yaml
Copy
Edit

---

## ⚙️ Quick Start

### 🔧 Requirements

- **Node.js** ≥ v16  
- **npm** ≥ v7  
- **DFX SDK** ≥ v0.15 ([Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install))

### 🚀 Setup

```bash
# Clone the project
git clone https://github.com/CipherG7/Nuru_Finance.git
cd Nuru_Finance

# Install dependencies
npm install

# Start local replica
dfx start --background

# Deploy canisters and generate declarations
dfx deploy
dfx generate

# Start frontend dev server
npm start
🖥️ Access app at: http://localhost:3000
🔧 Candid UI: http://localhost:4943/?canisterId=<your_canister_id>

🧪 Development & Scripts
bash
Copy
Edit
# Start local frontend dev server
npm start

# Build production bundle
npm run build

# Format code
npm run format

# Run tests
npm test

# DFX commands
dfx start
dfx deploy
dfx generate
dfx canister call nuru_backend <function>
🧬 Environment Variables
Create a .env file in the project root:

env
Copy
Edit
DFX_NETWORK=local
CANISTER_ID_NURU_BACKEND=xxxx
CANISTER_ID_NURU_FRONTEND=xxxx
🧰 API Overview (Motoko Canister)
Function	Description
createUser(?btcAddress)	Registers a new user
createSavingsPool(name, amount, duration)	Creates a savings goal or group pool
joinPool(poolId)	Join an existing pool
depositToPool(poolId, amount)	Add funds to a savings pool
getUserProfile()	View your user profile
getAllPools()	Fetch all pools on the platform

📄 Candid interface files located in src/declarations/.

🧠 Contribution Guide
We welcome your ideas and improvements!

🚧 How to Contribute
Fork and clone the repository

Create a feature branch

Make and test your changes

Commit using Conventional Commits

Open a pull request

✅ Dev Guidelines
✅ Follow Motoko and TypeScript best practices

✅ Write clean, readable, and well-documented code

✅ Maintain or improve test coverage

✅ All contributions via PRs only

✅ Update relevant docs when introducing new features

🧠 Helpful Resources
🌐 Internet Computer

📘 Motoko Docs

🛠️ DFX Developer Tools

🎨 Radix UI

💅 Tailwind CSS

🧩 Lucide React Icons

<p align="center"> <img src="https://your-preview-image.com/nuru-ui-preview.png" alt="Nuru UI Preview" width="75%"> </p> <p align="center"> <strong>Built for the decentralized future. Powered by the Internet Computer.</strong> </p> ```