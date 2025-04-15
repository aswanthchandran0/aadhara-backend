import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { validateFilesPresence,getSingleFile,validateFileSize,validateFileType } from "../utils/validator/imageValidation";
import path from "path";
import fs from "fs-extra";
import { preprocessImage } from "../ocr/preprocess";
import { extractTextFromImage } from "../ocr/extract";
import { parseAadhaarText } from "../utils/parser/aadhaarParser";
import { parseAadhaarWithAI } from "../ai/parseAadhaar";

export const processImages = async(req: Request, res: Response): Promise<void> => {
  try {
   
    // 1. Validate file presence
    if (!validateFilesPresence(req.files)) {
      throw new Error("Invalid file structure");
    }

     // 2. Get single files
     const image1 = getSingleFile(req.files.image1);
     const image2 = getSingleFile(req.files.image2);

      // 3. Validate size & type
      [image1, image2].forEach((file) => {
        validateFileSize(file);
        validateFileType(file);
      });
  
   // Save files temporarily
   const tempDir = path.join(__dirname,"../../temp")
      await fs.ensureDir(tempDir)

      //first image
      const original1Path = path.join(tempDir, "original1.png");
      const preprocessed1Path = path.join(tempDir, "preprocessed1.png");
      await fs.writeFile(original1Path, image1.data);
      await preprocessImage(original1Path, preprocessed1Path);

      //second image
      const original2Path = path.join(tempDir,"original2.png")
      const preprocessed2path = path.join(tempDir,"preprocessed2.png")
      await fs.writeFile(original2Path,image2.data)
      await preprocessImage(original2Path,preprocessed2path)

        // OCR
    const text1 = await extractTextFromImage(preprocessed1Path);
    const text2 = await extractTextFromImage(preprocessed2path)
    console.log("text1 ",text1)
    console.log("text2 ",text2)
    let aadhaarInfo;
    try {
      // Try OpenAI parsing first
      console.log("Trying AI parsing...");
      aadhaarInfo = await parseAadhaarWithAI(text1, text2);
    } catch (aiError) {
      const error = aiError as Error;
      console.warn("AI parsing failed, falling back to manual parser:", error.message);
      // Fallback to manual parser
      aadhaarInfo = parseAadhaarText(text1, text2);
    }
 
    console.log("aadhar info",aadhaarInfo)

// Cleanup
await fs.remove(tempDir);

res.json({
  success: true,
 aadhaarInfo
});

  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
