import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
    // token: process.env.COHERE_API_KEY!,
    token:"PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H"
  });
  
export async function parseAadhaarWithAI(text1: string, text2: string) {

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
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt: prompt,
      maxTokens: 300,
      temperature: 0,
    });

    const text = response.generations[0].text.trim();
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error("Cohere parsing failed:", error);
    return null;
  }
}