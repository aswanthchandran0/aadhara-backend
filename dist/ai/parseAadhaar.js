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
exports.parseAadhaarWithAI = parseAadhaarWithAI;
const cohere_ai_1 = require("cohere-ai");
const cohere = new cohere_ai_1.CohereClient({
    // token: process.env.COHERE_API_KEY!,
    token: "PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H"
});
function parseAadhaarWithAI(text1, text2) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `
    You are an OCR post-processing AI that receives two text inputs (front and back of Aadhaar). 
    Your job is to extract this format strictly in JSON:
    
    {
      "name": "",
      "dob": "",
      "gender": "",
      "aadhaarNumber": "",
      "address": ""
    }
    
    Text 1:
    ${text1}
    
    Text 2:
    ${text2}
    
    Only reply with JSON. Do not include any explanation.
    `;
        try {
            const response = yield cohere.generate({
                model: "command-r-plus",
                prompt: prompt,
                maxTokens: 300,
                temperature: 0,
            });
            const text = response.generations[0].text.trim();
            const json = JSON.parse(text);
            return json;
        }
        catch (error) {
            console.error("Cohere parsing failed:", error);
            return null;
        }
    });
}
