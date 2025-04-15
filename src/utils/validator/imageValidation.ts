import { UploadedFile } from "express-fileupload";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

type FilesWithImages = {
    image1: UploadedFile | UploadedFile[];
    image2: UploadedFile | UploadedFile[];
  };

export const validateFilesPresence = (files: any): files is FilesWithImages => {
    if (!files || !files.image1 || !files.image2) {
      throw new Error("Both images (image1, image2) are required");
    }
    return true;
  };



  export const getSingleFile = (file: UploadedFile | UploadedFile[]): UploadedFile => {
    if (Array.isArray(file)) {
      throw new Error("Only one file per field is allowed");
    }
    return file;
  };



  export const validateFileSize = (file: UploadedFile): void => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Each image must be 5MB or less");
    }
  };


  export const validateFileType = (file: UploadedFile): void => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error("Only JPEG and PNG image formats are allowed");
    }
  };
