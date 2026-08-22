require('dotenv').config();
const { ethers } = require('ethers');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// TrueCash Protocol Constants
const TRUECASH_ADDRESS = "0x6eBB428a6EDB41EF823634dF008098FE818EA208";
const PAYMASTER_ADDRESS = "0xA72408Afa36a7411694aaA799d08BB633496968A"; // Updated Mainnet Paymaster

// Config
const RPC_URL = process.env.RPC_URL || "https://bsc-dataseed.binance.org/";
const BACKEND_URL = process.env.BACKEND_URL || "https://shop.truecash.cc"; 

const provider = new ethers.JsonRpcProvider(RPC_URL);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startMiner(privateKey) {
    try {
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log(`\n==============================================`);
        console.log(`🚀 TrueCash Miner Node Activated`);
        console.log(`==============================================`);
        console.log(`[+] Connected Wallet: ${wallet.address}`);
        console.log(`[+] Network: Binance Smart Chain (Mainnet)`);
        console.log(`[+] Backend Mempool: ${BACKEND_URL}`);
        console.log(`[+] Listening for Zero-Gas Meta-Transactions...\n`);

        const paymasterAbi = [
            "function executeZeroGasTx(address customer, address merchant, uint256 amount, string memory orderId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external"
        ];
        const paymaster = new ethers.Contract(PAYMASTER_ADDRESS, paymasterAbi, wallet);

        // Miner Loop
        setInterval(async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/mempool/pending`);
                const pendingJob = await response.json();

                if (pendingJob) {
                    console.log(`\n[!] Incoming Job: Processing Order ${pendingJob.order_id}...`);
                    
                    try {
                        const tx = await paymaster.executeZeroGasTx(
                            pendingJob.from_wallet,
                            pendingJob.to_wallet,
                            pendingJob.amount,
                            pendingJob.order_id,
                            pendingJob.deadline,
                            pendingJob.sig_v,
                            pendingJob.sig_r,
                            pendingJob.sig_s
                        );
                        console.log(`[+] Transaction Submitted! Hash: ${tx.hash}`);
                        
                        console.log(`[+] Waiting for blockchain confirmation...`);
                        await tx.wait();
                        console.log(`[+] Confirmed! Automatically awarded 1 TRUECASH.`);

                        await fetch(`${BACKEND_URL}/api/mempool/complete`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                mempoolId: pendingJob.id,
                                txHash: tx.hash,
                                minerAddress: wallet.address
                            })
                        });
                        console.log(`[+] Backend notified. Job Complete.\n`);

                    } catch (txError) {
                        console.error(`[-] Transaction failed:`, txError.reason || txError.message);
                        await fetch(`${BACKEND_URL}/api/mempool/failed`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ mempoolId: pendingJob.id })
                        });
                    }
                }
            } catch (err) {
                // Ignore silent fetch timeouts if the backend is idle
            }
        }, 3000); // Poll every 3 seconds

    } catch (error) {
        console.error("\n[!] Error initializing miner:", error.message);
        console.log("Please ensure your private key is correct.");
        process.exit(1);
    }
}

console.log(`
  _____                ____          _     
 |_   _| __ _   _  ___/ ___|__ _ ___| |__  
   | || '__| | | |/ _ \\___ \\/ _\` / __| '_ \\ 
   | || |  | |_| |  __/___) | (_| \\__ \\ | | |
   |_||_|   \\__,_|\\___|____/ \\__,_|___/_| |_|
                                             
   --- Zero-Gas Miner Node (v1.0.0) ---
`);

const configPath = path.join(process.cwd(), 'miner_config.json');

if (process.env.RELAYER_PRIVATE_KEY) {
    console.log("Found RELAYER_PRIVATE_KEY in .env file.");
    startMiner(process.env.RELAYER_PRIVATE_KEY);
} else if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.PRIVATE_KEY) {
        console.log("Found saved Private Key in miner_config.json.");
        startMiner(config.PRIVATE_KEY);
    } else {
        promptForKey();
    }
} else {
    promptForKey();
}

function promptForKey() {
    rl.question("Please enter your Wallet Private Key to start mining: ", (answer) => {
        if (!answer) {
            console.log("Private key is required to earn yield.");
            process.exit(1);
        }
        const pkey = answer.trim();
        fs.writeFileSync(configPath, JSON.stringify({ PRIVATE_KEY: pkey }, null, 2));
        console.log("[+] Private key saved locally to miner_config.json for future use!");
        startMiner(pkey);
    });
}
