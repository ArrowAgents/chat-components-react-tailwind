"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeComponentFiles = writeComponentFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function writeComponentFiles(components, customPath) {
    const baseDir = customPath
        ? path_1.default.resolve(process.cwd(), customPath)
        : path_1.default.join(process.cwd(), "src", "components");
    for (const component of components) {
        for (const file of component.files) {
            const filePath = path_1.default.join(baseDir, file.name);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
            await fs_extra_1.default.writeFile(filePath, file.content);
        }
    }
}
