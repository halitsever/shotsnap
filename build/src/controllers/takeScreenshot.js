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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpGet_1 = __importDefault(require("../usecases/httpGet"));
const promises_1 = __importDefault(require("fs/promises"));
/**
 *
 * @param {string} pageUrl - Website url
 * @param {Array} screenSize - Screen size
 * @param {boolean} saveFile - Save file or not
 * @param {string} fileName - Saving by name
 * @returns {Buffer}
 */
const takeScreenshot = ({ pageUrl, screenWidth, screenHeight, saveFile, fileName, }) => __awaiter(void 0, void 0, void 0, function* () {
    const screenshot = yield (0, httpGet_1.default)(`https://shotsnap.vercel.app/api/screenshot?page=${pageUrl}&width=${screenWidth || 800}&height=${screenHeight || 768}`);
    if (saveFile)
        yield promises_1.default.writeFile(fileName || `shotsnap.png`, Buffer.from(screenshot));
    return Buffer.from(screenshot);
});
exports.default = takeScreenshot;
