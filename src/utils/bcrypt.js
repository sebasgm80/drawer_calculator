// NOTE: This is a minimal hashing utility for demonstration purposes.
// In production, handle authentication on a secure backend with a vetted library like bcrypt.

export const hash = async (password) => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const compare = async (password, hashValue) => {
  const hashedPassword = await hash(password);
  return hashedPassword === hashValue;
};

export default { hash, compare };
