import { trackException } from "services/errorTracker";

export function storeRollout(handle: string, group: string, lastProb) {
  try {
    window.localStorage.setItem(`${handle}_ada_chap_rollout_group`, group);
    window.localStorage.setItem(`${handle}_ada_chap_rollout_last_prob`, lastProb);
  } catch (e) {
    // Failed to set to localStorage
    trackException(e);
    return null;
  }
}

/**
 * Reads the stored rollout group and probability
 */
export function readRollout(handle: string) {
  const rollout = {
    group: null,
    lastProb: null
  };

  try {
    rollout.group = window.localStorage.getItem(`${handle}_ada_chap_rollout_group`);
    rollout.lastProb =
      JSON.parse(window.localStorage.getItem(`${handle}_ada_chap_rollout_last_prob`));
    return rollout;
  } catch (e) {
    // Failed to read localStorage
    trackException(e);
    return rollout;
  }
}

export default function checkRollout(rollout: number, handle: string) {
  if (typeof rollout === "number" && rollout >= 0 && rollout <= 1) {
    // We should first check the storage to see if this user is already grouped
    const rg = readRollout(handle);
    const rand = Math.random();

    if (rg.group === null || rg.lastProb === 0) {
      // No group assigned yet
      // A is control (does not see button)
      // B is variant (sees chat button)
      const roll = (rand <= rollout);
      const group = roll ? "B" : "A";
      const lastProb = rollout;
      storeRollout(handle, group, lastProb);
      return roll;
    }

    if (rg.group === "A" || rg.group === "B") {
      // Check to see if the remote rollout probability has changed from the last time it was set
      if (rg.lastProb !== null && rg.lastProb !== rollout) {
        // Probability has changed since the last time it was set
        // Use Gordon's function to determine who should move where
        if (rollout === 0) {
          // Move all B's to group A
          storeRollout(handle, "A", 0);
          return false;
        }

        if (rollout === 1) {
          // Move all A's to group B
          storeRollout(handle, "B", 1);
          return true;
        }

        if (rollout < rg.lastProb) {
          // DOWNGRADE CASE
          // If you are in group B you now could be moved to group A
          if (rg.group === "B") {
            const adjustedProb = (1 - (rollout / rg.lastProb));
            const shouldMove = (rand <= adjustedProb);
            const group = shouldMove ? "B" : "A";
            storeRollout(handle, group, rollout);
            return shouldMove;
          }
        } else if (rollout > rg.lastProb) {
          // UPGRADE CASE
          // If you are in group A, you now have an opportunity to become group B
          if (rg.group === "A") {
            const adjustedProb = (1 - (rg.lastProb / rollout));
            const shouldMove = (rand <= adjustedProb);
            const group = shouldMove ? "B" : "A";
            storeRollout(handle, group, rollout);
            return shouldMove;
          }
        }
      } else {
        // Probability is the same as before.
        return (rg.group === "B");
      }
    }
  }

  // Default to being on just in case of unforeseen failure cases
  return true;
}
