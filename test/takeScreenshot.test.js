const { takeScreenshot } = require("../src/index");
test("Testing get a screenshot from a page", async () => {
  const screenshot = await takeScreenshot({ pageUrl: "https://google.com" });
  expect(typeof screenshot).toBe("object");
});
