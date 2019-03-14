import * as Sentry from "@sentry/browser";

/**
 * @param {Error} error
 */
export function trackException(error) {
  Sentry.captureException(error);
}
