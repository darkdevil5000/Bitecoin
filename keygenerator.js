const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Function to generate a new key pair
function generateKeyPair() {
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex'); // This is your wallet address
    const privateKey = keyPair.getPrivate('hex');
    return { publicKey, privateKey };
}

// Generate a new key pair
const { publicKey, privateKey } = generateKeyPair();

// Output the wallet address
console.log('Your public key (wallet address):', publicKey);
console.log('Your private key:', privateKey);



function generateKeyPair() {
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex'); 
    const privateKey = keyPair.getPrivate('hex');
    return { publicKey, privateKey };
  }
  
  // Generate a new key pair for another wallet
  const anotherKeyPair = generateKeyPair();
  const anotherPublicKey = anotherKeyPair.publicKey;
  const anotherPrivateKey = anotherKeyPair.privateKey;
  
  console.log('Another wallet public key:', anotherPublicKey);
  console.log('Another wallet private key:', anotherPrivateKey);