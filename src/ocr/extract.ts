import { createWorker } from "tesseract.js";
import path from "path";

export const extractTextFromImage = async (imagePath:string):Promise<string> =>{
    const worker =  await createWorker("eng")
    
    const {data:{text}, } = await worker.recognize(imagePath)
    await worker.terminate()
    return text
}