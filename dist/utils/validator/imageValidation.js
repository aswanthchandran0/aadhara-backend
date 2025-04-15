"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileType = exports.validateFileSize = exports.getSingleFile = exports.validateFilesPresence = void 0;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const validateFilesPresence = (files) => {
    if (!files || !files.image1 || !files.image2) {
        throw new Error("Both images (image1, image2) are required");
    }
    return true;
};
exports.validateFilesPresence = validateFilesPresence;
const getSingleFile = (file) => {
    if (Array.isArray(file)) {
        throw new Error("Only one file per field is allowed");
    }
    return file;
};
exports.getSingleFile = getSingleFile;
const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("Each image must be 5MB or less");
    }
};
exports.validateFileSize = validateFileSize;
const validateFileType = (file) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new Error("Only JPEG and PNG image formats are allowed");
    }
};
exports.validateFileType = validateFileType;
