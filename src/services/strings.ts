/**
 * Polyfill String.startsWith IE 9 - 11
 */
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
      value: function(search, pos) {
          pos = !pos || pos < 0 ? 0 : +pos;
          return this.substring(pos, pos + search.length) === search;
      }
  });
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}
