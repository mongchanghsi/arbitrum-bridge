# 🌉 Arbitrum Bridge (Sepolia → Arbitrum Sepolia)

A lightweight Web3 bridge interface that allows users to seamlessly transfer ETH from Ethereum Sepolia to Arbitrum Sepolia using a clean, glassmorphism UI and step-based transaction feedback.

---

## ✨ Features

- 🔗 **Wallet Connection**
  - Integrated with Reown AppKit for seamless wallet onboarding

- 💸 **ETH Bridging**
  - Bridge ETH from Sepolia to Arbitrum Sepolia via proxy contract

- 📊 **Step-based Transaction Tracking**
  - Real-time status updates:
    - Not Started
    - Loading
    - Completed
    - Failed

- 🧊 **Modern Glass UI**
  - Built with Tailwind CSS
  - Backdrop blur + translucent components
  - Clean and minimal Web3 UX

- 🔍 **Explorer Integration**
  - View transactions directly on Etherscan / Arbiscan

---

## 🧠 Architecture Overview

### Frontend

- **Next.js**
- **React + TypeScript**
- **Tailwind CSS**

### Web3 Stack

- **Reown AppKit** – Wallet connection
- **wagmi / viem** – Blockchain interactions
- **Custom hook (`useBridge`)** – Handles bridging logic + state

---

## 🔄 Bridge Flow

1. User connects wallet
2. Inputs ETH amount (validated up to 6 decimal places)
3. Initiates bridge transaction
4. UI updates step-by-step:
   - Approval / Initiation
   - L1 Transaction submission
   - L2 execution (Arbitrum)
5. Transaction hash is generated and linked to explorer

---

## 🧩 Key Components

### `Bridge`

- Main container for input, button, and status
- Manages amount state and user interactions

### `AmountInput`

- Controlled input field
- Restricts to numeric values with up to 6 decimals

### `StatusStep`

- Displays transaction progress
- Minimal stepper UI with:
  - Loading spinner
  - Success / failure indicators
  - Optional transaction hash

### `useBridge`

- Encapsulates bridge logic
- Returns:
  - `bridgeWithProxy`
  - `statusSteps`

---

## 🎨 UI Design

- Glassmorphism-based design system:
  - `bg-white/10`
  - `backdrop-blur-md`
  - subtle borders and shadows
- Focus on:
  - clarity
  - minimalism
  - low cognitive load

---

## 🚀 Getting Started

Get your Reown Project ID from [Reown](https://reown.com/) and paste it in `.env.template`

```bash
npm install
cp .env.template .env
npm run dev
```
