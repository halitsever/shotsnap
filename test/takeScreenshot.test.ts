import { describe, expect, test } from "@jest/globals";
import { takeScreenshot } from "../src/index";

describe("Function: takeScreenshot", () => {
  test("It should be return arrayBuffer", async () => {
    const screenshot = await takeScreenshot({
      pageUrl: "https://google.com",
      saveFile: false,
    });
    expect(typeof screenshot).toBe("object");
  });
});
