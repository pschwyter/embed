/**
 * Detect if browser is IE9 or lower
 * @returns {Boolean}
 */
export function isIE9OrBelow() {
  return /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10;
}
