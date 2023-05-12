import { headers } from "next/dist/client/components/headers";

export default async function request<T>(
  url: string,
  params: RequestInit
): Promise<T> {
  try {
    const resp = await fetch(url, {
      ...params,
      headers: {
        ...params.headers,
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) throw new Error(resp.statusText || "Unknown error");

    return resp.json();
  } catch (error) {
    console.error(`failed to fetch ${url}`, error);
    throw error;
  }
}
