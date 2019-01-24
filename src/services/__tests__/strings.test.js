import { capitalize } from "services/strings";


describe("capitalize function", () => {
  it("should capitalize a lowercased string", () => {
    const testString = "yolo";

    expect(capitalize(testString)).toBe("Yolo");
  });
});
