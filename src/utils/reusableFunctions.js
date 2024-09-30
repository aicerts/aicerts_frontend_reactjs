import CryptoJS from 'crypto-js';

// Debounced function to fetch suggestions
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

   const encryptData = (data) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encrypted;
};

export {encryptData}
