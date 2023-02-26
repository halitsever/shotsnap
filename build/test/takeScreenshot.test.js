"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("../src/index");
(0, globals_1.describe)("Function: takeScreenshot", () => {
    (0, globals_1.test)("It should be return arrayBuffer", () => __awaiter(void 0, void 0, void 0, function* () {
        const screenshot = yield (0, index_1.takeScreenshot)({
            pageUrl: "https://google.com",
            saveFile: false,
        });
        (0, globals_1.expect)(typeof screenshot).toBe("object");
    }));
});
