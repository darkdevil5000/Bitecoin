const { Blockchain, Transaction } = require('./blockchain.js');
const EC = require('elliptic').ec;
const prompt = require('prompt-sync')({ sigint: true });
const ec = new EC('secp256k1');


function generateKeyPair() {
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex'); 
    const privateKey = keyPair.getPrivate('hex');
    return { publicKey, privateKey };
}


function createAndSignTransaction(senderPrivateKey, recipientAddress, amount) {
    const senderKey = ec.keyFromPrivate(senderPrivateKey);
    const senderPublicKey = senderKey.getPublic('hex');
    const tx = new Transaction(senderPublicKey, recipientAddress, amount);
    tx.signTransaction(senderKey);
    return tx;
}

// Instantiate blockchain
let Bitecoin = new Blockchain();

// Prompt user for key generation or existing key usage
const useExistingKeys = prompt('Do you want to use an existing key pair? (yes/no): ').toLowerCase();

let myKey;
if (useExistingKeys === 'yes') {
    const privateKey = prompt('Enter your private key: ');
    myKey = ec.keyFromPrivate(privateKey);
} else {
    // Generate new keys
    const { publicKey, privateKey } = generateKeyPair();
    console.log('Your public key (wallet address):', publicKey);
    console.log('Your private key:', privateKey);
    myKey = ec.keyFromPrivate(privateKey);
}

const myWalletAddress = myKey.getPublic('hex');

// Mine pending transactions to refill your balance
console.log('\nStarting the miner to refill balance...');
Bitecoin.minePendingTransactions('43d658fe1330d5c54f20d578f67632b7bffa1075303621beea0f6ddf9f6bef80');  

// Check the updated balance
console.log('\nBalance of your wallet is', Bitecoin.getBalanceofAddress(myWalletAddress));



let anotherTransaction = 'yes';

while (anotherTransaction === 'yes') {
    const recipientAddress = prompt('Enter recipient public key (valid public key): ').trim();

    // Validate the input only after pasting
    if (!recipientAddress || recipientAddress.length !== 130) { // Assuming standard hex public key length
        console.log('Please enter a valid public key.');
        continue; // Skip to the next iteration of the loop
    }

    const amount = parseFloat(prompt('Enter amount to send: '));

    // Check if the amount is valid
    if (isNaN(amount) || amount <= 0) {
        console.log('Please enter a valid amount greater than 0.');
        continue; // Skip to the next iteration of the loop
    }

    // Check if the sender has enough balance before adding the transaction
    const currentBalance = Bitecoin.getBalanceofAddress(myWalletAddress);
    if (amount > currentBalance) {
        console.log(`Insufficient balance. Your current balance is ${currentBalance}.`);
        continue; // Skip to the next iteration of the loop
    }

    // Create and sign the transaction
    const tx = createAndSignTransaction(myKey.getPrivate('hex'), recipientAddress, amount);
    Bitecoin.addTransaction(tx);

    anotherTransaction = prompt('Do you want to add another transaction? (yes/no): ').toLowerCase();
}

// Mine pending transactions after user inputs are done
console.log('\nStarting the miner...');
Bitecoin.minePendingTransactions(myWalletAddress);

// Display balance of the user's wallet
console.log('\nBalance of your wallet is', Bitecoin.getBalanceofAddress(myWalletAddress));

// Show detailed transaction information
console.log('Transactions in the last mined block:');
const latestBlock = Bitecoin.getLatestBlock();
latestBlock.transactions.forEach((tx, index) => {
    console.log(`Transaction ${index + 1}:`);
    console.log(`  From: ${tx.fromAddress || 'Miner'}`);
    console.log(`  To: ${tx.toAddress}`);
    console.log(`  Amount: ${tx.amount}`);
    console.log(`  Signature: ${tx.signature || 'N/A'}`);
});

// Validate the blockchain
console.log('\nIs chain valid?', Bitecoin.isChainValid());
