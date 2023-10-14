// Import the necessary functions from the 'libsodium-wrappers' module
import * as sodium from 'libsodium-wrappers';

// Function to generate a random 256-bit (32-byte) symmetric encryption key
const generateRandomKey = async () => {
  await sodium.ready;
  return sodium.crypto_secretbox_keygen();
};

// Function to encrypt a message with a symmetric key
const encryptMessage = async (message, key) => {
  await sodium.ready;

  // Generate a random nonce
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  // Encrypt the message
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);

  return { ciphertext, nonce };
};

// Function to decrypt an encrypted message with a symmetric key
const decryptMessage = async (ciphertext, nonce, key) => {
  await sodium.ready;

  // Decrypt the message
  try {
    const decryptedMessage = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    return decryptedMessage;
  } catch (error) {
    throw new Error('Decryption failed: Invalid key or ciphertext');
  }
};

(async () => {
  // Generate a random symmetric key
  const key = await generateRandomKey();

  // Message to encrypt
  const originalMessage = 'This is a secret message!';

  // Encrypt the message
  const { ciphertext, nonce } = await encryptMessage(originalMessage, key);

  console.log('Original Message:', originalMessage);

  // Decrypt the message
  try {
    const decryptedMessage = await decryptMessage(ciphertext, nonce, key);
    console.log('Decrypted Message:', decryptedMessage);
  } catch (error) {
    console.error(error.message);
  }
})();
