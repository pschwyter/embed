/**
 * Polyfill Promise for IE 9 - 11
 */
import { Promise } from "es6-promise";

declare const XDomainRequest;
interface InterfaceRequestObject {
  url: string,
  body?: string,
  method?: string,
  headers?: object
}

/**
 * Vanilla HTTP request. Returns a Promise.
 */
export default function httpRequest(obj: InterfaceRequestObject): Promise<any> {
  return new Promise((resolve, reject) => {
    const method = obj.method || "GET";
    let xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
      // XMLHttpRequest for Chrome/Firefox/Opera/Safari.
      xhr.open(method, obj.url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, obj.url);
      // These are needed to prevent IE9 aborting requests :(
      /* tslint:disable */
      xhr.onprogress = () => {};
      xhr.ontimeout = () => {};
      /* tslint:enable */
    } else {
      // CORS not supported.
      xhr = null;
      return;
    }

    if (obj.headers) {
      Object.keys(obj.headers).forEach((key) => {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(
          JSON.parse(xhr.response)
        );
      } else if (typeof XDomainRequest !== "undefined" && xhr.responseText) {
        resolve(
          JSON.parse(xhr.responseText)
        );
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
}
