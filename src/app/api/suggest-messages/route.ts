import { GoogleGenerativeAI } from '@google/generative-ai';  

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Google API key is not set in the environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const runtime = 'edge';

export async function GET() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
      
    const response = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
    }).generateContent(prompt);

    const generatedText = response.response.text();

    return Response.json({ text: generatedText });

  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred:', error);
      return Response.json({ message: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
