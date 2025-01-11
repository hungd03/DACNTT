import { AUTH_CONSTANTS } from "./constants";

export const validateEmailDomain = (
  email: string | null | undefined
): boolean => {
  if (!email) return false;
  const domain = email.split("@")[1];
  return AUTH_CONSTANTS.ALLOWED_EMAIL_DOMAINS.includes(domain);
};

export const formatEmailForDisplay = (email: string): string => {
  const [username, domain] = email.split("@");
  const maskedUsername = username.slice(0, 2) + "*".repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
};

export const getLocalStorageWithExpiry = (key: string): string | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const data = JSON.parse(item);
  if (Date.now() > data.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return data.value;
};

export const setLocalStorageWithExpiry = (
  key: string,
  value: string,
  expiryHours: number
): void => {
  const item = {
    value: value,
    expiry: Date.now() + expiryHours * 60 * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};
