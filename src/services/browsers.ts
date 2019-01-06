/**
 * Detect if browser is IE9 or lower
 */
export function isIE9OrBelow(): boolean {
  return /MSIE\s/
    .test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10;
}
