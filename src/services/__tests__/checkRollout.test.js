import checkRollout from "services/checkRollout";

describe("checkRollout service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return true when rollout is set to 1", () => {
    expect(checkRollout(1, "test")).toBeTruthy();
  });

  it("should return true when rollout is set to 1, even if previously set rollout is 0", () => {
    checkRollout(0, "test");
    expect(checkRollout(1, "test")).toBeTruthy();
  });

  it("should return false when rollout is set to 0", () => {
    expect(checkRollout(0, "test")).toBeFalsy();
  });
});
