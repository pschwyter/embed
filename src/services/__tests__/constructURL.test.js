import constructURL, { getMetaVariableString } from "services/constructURL";

describe("checkRollout service", () => {
  it("should use the handle specified", () => {
    const url = constructURL({
      handle: "nic",
      cluster: undefined,
      language: "fr",
      private: true
    });

    expect(url.includes("nic")).toBeTruthy();
  });

  it("should include the cluster if specified", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      private: true
    });

    expect(url.includes("nic.ca")).toBeTruthy();
  });

  it("should set private to 1 in the query string if private boolean is true", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      private: true
    });

    expect(url.includes("private=1")).toBeTruthy();
  });

  it("should set url location as a query string param if isForAPI is true", () => {
    const url = constructURL({
      handle: "nic",
      cluster: "ca",
      language: "fr",
      private: true
    }, true);

    expect(url.includes("url=https://nic.ca.ada.support/")).toBeTruthy();
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
      private: true
    }, true);
    expect(url.match(/&/g).length).toBe(2);
    expect(url.match(/\?/g).length).toBe(1);
  });
});

describe("getMetaVariableString function", () => {
  it("should output a '&' separated string of key-value pairs", () => {
    const dummyMetaVariables = {
      test1: "yolo",
      test2: 10,
      test3: "stuff"
    }

    const expected = "test1=yolo&test2=10&test3=stuff";

    expect(getMetaVariableString(dummyMetaVariables)).toBe(expected);
  });

  it("should ignore reserved words (language, url, private)", () => {
    const dummyMetaVariables = {
      test1: "yolo",
      test2: 10,
      test3: "stuff",
      language: "french"
    }

    const expected = "test1=yolo&test2=10&test3=stuff";

    expect(getMetaVariableString(dummyMetaVariables)).toBe(expected);
  });
});
