import Client from "models/Client";
import { PERSISTENCE_NORMAL, PERSISTENCE_SESSION } from "constants/store";

/**
 * Store key/value into appropriate storage based on client persistence
 */
export function store(client: Client, key: string, value: string) {
  const { persistence } = client;
  const modifiedKey = modifyKey(client, key);
  if (persistence === PERSISTENCE_NORMAL) {
    localStorage.setItem(modifiedKey, value);
  } else if (persistence === PERSISTENCE_SESSION) {
    sessionStorage.setItem(modifiedKey, value);
  }
}

/**
 * Get value from the appropriate storage based on client persistence
 */
export function retrieve(client: Client, key: string) {
  const { persistence } = client;
  const modifiedKey = modifyKey(client, key);
  if (persistence === PERSISTENCE_NORMAL) {
    return localStorage.getItem(modifiedKey);
  }

  if (persistence === PERSISTENCE_SESSION) {
    return sessionStorage.getItem(modifiedKey);
  }
  return null;
}

/**
 * Remove value from the appropriate storage based on client persistence
 */
export function removeStore(client: Client, key: string) {
  const { persistence } = client;
  const modifiedKey = modifyKey(client, key);
  if (persistence === PERSISTENCE_NORMAL) {
    return localStorage.removeItem(modifiedKey);
  }

  if (persistence === PERSISTENCE_SESSION) {
    return sessionStorage.removeItem(modifiedKey);
  }
  return null;
}

/**
 * Modify the key to include client hanle
 */
function modifyKey(client: Client, key: string) {
  return `${client.handle}_${key}`;
}
