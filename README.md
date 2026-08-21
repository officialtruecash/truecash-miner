<div align="center">
  <img src="https://raw.githubusercontent.com/TrueCash/truecash-miner/main/logo.png" alt="TrueCash Logo" width="120" />
  <h1>TrueCash Zero-Gas Miner Node</h1>
  <p>Earn TCASH by relaying Zero-Gas Meta-Transactions on the Binance Smart Chain.</p>
</div>

---

## 🚀 What is this?

TrueCash ($TCASH) is an ecosystem that completely eliminates gas fees for end-users. When a customer makes a purchase on the TrueCash Marketplace or sends a P2P transfer, they don't pay any BNB. 

Instead, their transaction is securely signed and broadcasted to a **Mempool**. 

This repository contains the **TrueCash Miner Node** code. Anyone can run this node on their computer to monitor the TrueCash Mempool. When a transaction appears, your node automatically pays the tiny BNB gas fee to execute it on the blockchain, and the TrueCash Smart Contract instantly rewards you with highly profitable **TCASH Rewards**!

## 🛡️ Recommended Setup: Dedicated Mining Wallet

To operate this node, you must provide a wallet private key so the script can sign transactions and pay gas fees on your behalf. 

For the highest security and cleanest accounting of your profits, we highly recommend creating a **dedicated mining wallet**:
1. Create a new wallet address in MetaMask specifically for mining.
2. Send a small amount of BNB ($2 to $5) to this new wallet to cover gas fees.
3. Use the private key of this dedicated wallet in the miner.
4. Periodically transfer your earned TCASH profits to your main storage wallet.

Using a dedicated wallet is an industry best-practice for node operators. It ensures your main funds are kept safely in cold storage while your miner runs 24/7.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- A dedicated MetaMask Burner Wallet with a small amount of BNB on the Binance Smart Chain (Mainnet).

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/truecash-miner.git
cd truecash-miner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Miner
```bash
node index.js
```

### 4. Configuration
The first time you run the miner, the console will prompt you:
`Please enter your Wallet Private Key to start mining:`

Paste your Burner Wallet's private key and press Enter. The script will automatically generate a secure, hidden `miner_config.json` file on your computer. The next time you run the miner, it will read this config file and start mining automatically without asking!

*(Advanced users: You can also create a `.env` file containing `PRIVATE_KEY=your_key`.)*

---

## 📈 Mining Economics & Profitability

TrueCash utilizes a dynamic halving schedule pegged to the market valuation of TCASH to ensure mining is always profitable.

Currently, standard gas fees on Binance Smart Chain are extremely low (~0.000005 BNB). This costs the miner fractions of a cent per transaction.

| Market Valuation (BNB/TCASH) | Est. Gas Cost (BNB) | Miner Reward (TCASH) | Profit Margin |
| :--- | :--- | :--- | :--- |
| **1 BNB = 50,000 TCASH** | ~0.000005 BNB | **1.0 TCASH** | **Variable** |
| 1 BNB = 40,000 TCASH | ~0.000005 BNB | 0.8 TCASH | Variable |
| 1 BNB = 30,000 TCASH | ~0.000005 BNB | 0.6 TCASH | Variable |

When your node executes a transaction, the TrueCash Smart Contract guarantees that the customer's transfer AND your mining reward are processed in the exact same atomic transaction block. 

---

## 🧑‍💻 Contributing
TrueCash is a decentralized, community-driven economy. If you have suggestions to make the miner more efficient, feel free to submit a Pull Request!

## 📄 License
This project is licensed under the MIT License.
