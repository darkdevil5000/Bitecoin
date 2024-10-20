const EC = require('elliptic').ec;
const SHA256 = require("crypto-js/sha256");

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.difficulty = 2;
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = new Block(0, "Genesis Block", "0");
    this.chain.push(genesisBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress || !transaction.amount) {
      console.log("Invalid transaction");
      return false;
    }

    if (transaction.amount <= 0) {
      console.log("Invalid transaction amount");
      return false;
    }

    this.pendingTransactions.push(transaction);
    return true;
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new Block(this.chain.length, this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  getBalanceofAddress(address) {
    let balance = 100;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

class Block {
  constructor(index, transactions, previousHash = "") {
    this.index = index;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.hash = "";
    this.nonce = 0;
    this.difficulty = 2;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.signature = "";
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') === this.fromAddress) {
        console.log('You cannot sign transaction for other Wallets');
        return;
  }
}

}

module.exports = { Blockchain, Transaction };