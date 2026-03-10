import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";

export const genAI = new GoogleGenerativeAI(apiKey);

export async function askAgent(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel(
        { model: "gemini-2.5-pro" },
        {
            apiVersion: 'v1alpha',
            baseUrl: 'https://jules.googleapis.com',
            customHeaders: { 'X-Goog-Api-Key': apiKey }
        }
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function generateRepairPrompt(failedCommand: string, errorMsg: string): Promise<string> {
    const prompt = `The command '${failedCommand}' failed with the following error:\n\n${errorMsg}\n\nProvide ONLY the fixed bash command or file changes required to fix this issue. If it's a bash command, provide only the command as text without markdown blocks.`;

    const repairResponse = await askAgent(prompt);
    return repairResponse.replace(/^```(bash)?/gm, '').replace(/```$/gm, '').trim();
}
