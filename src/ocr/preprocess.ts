import sharp from "sharp";
import fs from "fs-extra";
import path from "path";



export const preprocessImage = async (inputPath: string, outputPath: string): Promise<void> => {
    await sharp(inputPath)
      .grayscale()
      .normalize()
      .toFile(outputPath);
  };