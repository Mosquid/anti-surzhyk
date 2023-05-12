import { get } from "@/services/redis";
import { NextApiRequest, NextApiResponse } from "next";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const { ts } = req.body;

  let data = await get(String(ts));

  for (let i = 0; i < 30; i++) {
    if (data) {
      return res.status(200).json(data);
    }

    await wait(3000);
    data = await get(ts);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
