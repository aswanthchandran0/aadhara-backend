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
exports.processImages = void 0;
const imageValidation_1 = require("../utils/validator/imageValidation");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const preprocess_1 = require("../ocr/preprocess");
const extract_1 = require("../ocr/extract");
const aadhaarParser_1 = require("../utils/parser/aadhaarParser");
const parseAadhaar_1 = require("../ai/parseAadhaar");
const processImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Validate file presence
        if (!(0, imageValidation_1.validateFilesPresence)(req.files)) {
            throw new Error("Invalid file structure");
        }
        // 2. Get single files
        const image1 = (0, imageValidation_1.getSingleFile)(req.files.image1);
        const image2 = (0, imageValidation_1.getSingleFile)(req.files.image2);
        // 3. Validate size & type
        [image1, image2].forEach((file) => {
            (0, imageValidation_1.validateFileSize)(file);
            (0, imageValidation_1.validateFileType)(file);
        });
        // Save files temporarily
        const tempDir = path_1.default.join(__dirname, "../../temp");
        yield fs_extra_1.default.ensureDir(tempDir);
        //first image
        const original1Path = path_1.default.join(tempDir, "original1.png");
        const preprocessed1Path = path_1.default.join(tempDir, "preprocessed1.png");
        yield fs_extra_1.default.writeFile(original1Path, image1.data);
        yield (0, preprocess_1.preprocessImage)(original1Path, preprocessed1Path);
        //second image
        const original2Path = path_1.default.join(tempDir, "original2.png");
        const preprocessed2path = path_1.default.join(tempDir, "preprocessed2.png");
        yield fs_extra_1.default.writeFile(original2Path, image2.data);
        yield (0, preprocess_1.preprocessImage)(original2Path, preprocessed2path);
        // OCR
        const text1 = yield (0, extract_1.extractTextFromImage)(preprocessed1Path);
        const text2 = yield (0, extract_1.extractTextFromImage)(preprocessed2path);
        console.log("text1 ", text1);
        console.log("text2 ", text2);
        let aadhaarInfo;
        try {
            // Try OpenAI parsing first
            console.log("Trying AI parsing...");
            aadhaarInfo = yield (0, parseAadhaar_1.parseAadhaarWithAI)(text1, text2);
        }
        catch (aiError) {
            const error = aiError;
            console.warn("AI parsing failed, falling back to manual parser:", error.message);
            // Fallback to manual parser
            aadhaarInfo = (0, aadhaarParser_1.parseAadhaarText)(text1, text2);
        }
        console.log("aadhar info", aadhaarInfo);
        // Cleanup
        yield fs_extra_1.default.remove(tempDir);
        res.json({
            success: true,
            aadhaarInfo
        });
    }
    catch (error) {
        console.error("Error processing images:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.processImages = processImages;
