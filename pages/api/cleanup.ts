// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { set } from "@/services/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const API_KEY = process.env.API_KEY;

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;
  const messages: Array<ChatCompletionRequestMessage> = [
    {
      content: `Hey. I have a ukrainian text which contains surzhuk and russian words and perhaps incorrect grammar. I need to translate it to ukrainian. Could you help me? Here is the text: 
      ---
      ${text}. 
      ---
      ###
      The message you send back to me should not contain any additional information and should only provide a translated version of the input text.`,
      role: "user",
    },
  ];

  const ts = new Date().getTime();
  try {
    res.status(200).json({ ts });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      messages,
    });
    const { message } = response.data.choices[0];
    const { content = "" } = message || {};

    console.log(response.data.choices);

    await set(ts.toString(), { content });
  } catch (error) {
    console.error(error);
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
