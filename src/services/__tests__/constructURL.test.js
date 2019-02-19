import constructURL, { getMetaFieldstring } from "services/constructURL";

describe("constructURL", () => {
  it("should use the handle specified", () => {
    const url = constructURL({
      handle: "nic",
      cluster: undefined,
      language: "fr",
      privateMode: true
    });

    expect(url.includes("nic")).toBeTruthy();
  });

  it("should include the cluster if specified", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      privateMode: true
    });

    expect(url.includes("nic.ca")).toBeTruthy();
  });

  it("should set private to 1 in the query string if private boolean is true", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      privateMode: true
    });

    expect(url.includes("private=1")).toBeTruthy();
  });

  it("should set url location as a query string param if isForAPI is true", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca"
    }, true);

    expect(url.includes("url=https://nic.ca.ada.support/")).toBeTruthy();
  });

  it("should ommit other query parameters from the query string if isForAPI is true", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      privateMode: true
    }, true);

    expect(url).toBe("https://nic.ca.ada.support/api/?url=https://nic.ca.ada.support/");
  });

  it("should set language in the query string if specified", () => {
    const url = constructURL({
      handle: "nic",
      language: "fr"
    });

    expect(url.includes("language=fr")).toBeTruthy();
  });

  it("should separate query params with '&', and lead with '?'", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      privateMode: true,
      greeting: "123"
    }, false);
    expect(url.match(/&/g).length).toBe(2);
    expect(url.match(/\?/g).length).toBe(1);
  });

  it("should append metaFields to URL if not for API (second arg is false)", () => {
    const url = constructURL({
      handle: "nic",
      metaFields: {
        test1: "yolo",
        test2: "yodo"
      }
    }, false);

    expect(url).toBe("https://nic.ada.support/chat/?test1=yolo&test2=yodo");
  });

  it("should not include metaFields if undefined", () => {
    const url = constructURL({
      handle: "nic"
    }, false);

    expect(url).toBe("https://nic.ada.support/chat/");
  });

  it("should add followUpResponseId to URL if provided", () => {
    const url = constructURL({
      handle: "nic",
      followUpResponseId: "123"
    }, false);

    expect(url).toBe("https://nic.ada.support/chat/?followUpResponseId=123");
  });

  it("should include the greeting id in the Chat URL if specified in adaSettings", () => {
    const url = constructURL({
      handle: "nic",
      greeting: "123"
    }, false);

    expect(url).toBe("https://nic.ada.support/chat/?greeting=123");
  });
});

describe("getMetaFieldstring function", () => {
  it("should output a '&' separated string of key-value pairs", () => {
    const dummyMetaFields = {
      test1: "yolo",
      test2: 10,
      test3: "stuff"
    }

    const expected = "test1=yolo&test2=10&test3=stuff";

    expect(getMetaFieldstring(dummyMetaFields)).toBe(expected);
  });

  it("should ignore reserved words (language, url, private)", () => {
    const dummyMetaFields = {
      test1: "yolo",
      test2: 10,
      test3: "stuff",
      language: "french"
    }

    const expected = "test1=yolo&test2=10&test3=stuff";

    expect(getMetaFieldstring(dummyMetaFields)).toBe(expected);
  });
});
