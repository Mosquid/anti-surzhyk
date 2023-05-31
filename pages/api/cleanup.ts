// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { set } from "@/services/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import GPTOverlord from "gpt-overlord";

const API_KEY: string = process.env.API_KEY || "";

const overlord = new GPTOverlord({
  apiKey: API_KEY,
  model: "gpt-3.5-turbo",
  temperature: 0.1,
  schema: {
    status: "success | error",
    data: "<corrected_text>",
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;
  const prompt = `I have a ukrainian text which contains surzhuk and russian words and perhaps incorrect grammar. I need your help fixing it. Please replace the russian words and grammar where possible. Here is the text: 
      ---
      ${text}`;

  const ts = new Date().getTime();
  try {
    res.status(200).json({ ts });
    const response = await overlord.prompt(prompt);

    const { data: content, status }: { status: string; data: string } =
      response;

    if (status !== "success") {
      throw new Error("GPT3 error" + content);
    }

    await set(ts.toString(), { content });
  } catch (error) {
    await set(ts.toString(), {
      error: (error as Error).message,
      content: "",
    });
    res.status(400).json({ error });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
