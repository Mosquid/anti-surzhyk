import { get } from "@/services/redis";
import { NextApiRequest, NextApiResponse } from "next";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const { ts } = req.body;
  console.log({ pullTs: ts });
  let content = await get(String(ts));

  for (let i = 0; i < 30; i++) {
    if (content) {
      return res.status(200).json({ content });
    }

    await wait(3000);
    content = await get(ts);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
