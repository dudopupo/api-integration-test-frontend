import CryptoJS from 'crypto-js';

export const createSignature = (body: unknown, secretKey: string): string => {
  const payload = !body ? JSON.stringify(body) : '{}';
  return CryptoJS.HmacSHA512(payload, secretKey).toString(CryptoJS.enc.Hex);
};