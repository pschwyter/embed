declare var XDomainRequest;

interface InterfaceRequestObject {
  headers: object,
  method: string,
  url: string,
  body: string
}

/**
 * Vanilla HTTP request. Returns a Promise.
 */
export default function httpRequest(obj: InterfaceRequestObject): Promise<object> {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    // xhr.open(obj.method || "GET", obj.url);

    if ("withCredentials" in xhr) {
      // XMLHttpRequest for Chrome/Firefox/Opera/Safari.
      xhr.open("GET", obj.url, true);

    } else if (typeof XDomainRequest !== "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open("GET", obj.url);

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
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
}
