import { encrypting, decrypting } from "../utils/index.js";

export function encryptPhoneNumber(user) {
  if (user?.phoneNumber) user.phoneNumber = encrypting(user.phoneNumber);
}

export function decryptPhoneNumber(user) {
  if (user?.phoneNumber) user.phoneNumber = decrypting(user.phoneNumber);
}
