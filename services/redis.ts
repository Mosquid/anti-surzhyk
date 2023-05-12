import { Redis } from "ioredis";
const client = new Redis({
  host: process.env.REDIS_ENDPOINT,
  port: 12120,
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => {
  console.log(`Redis client error ${err}`);
});

export async function set(
  key: string,
  value: { content: string; error?: string }
) {
  try {
    await client.set(key, JSON.stringify(value));
    await client.expire(key, 60);
  } catch (error) {
    console.error({ error });
  }
}

export async function get(key: string) {
  try {
    const val = await client.get(key);
    return val && JSON.parse(val);
  } catch (error) {
    console.error(error);
  }
}
