import { useQuery } from "@tanstack/react-query";
import request from "@/services/request";

const getPull = async (ts: number | null) => {
  const parsed: { content: string } = await request(`/api/pull/`, {
    method: "POST",
    body: JSON.stringify({ ts: String(ts) }),
  });

  return parsed;
};

const usePull = (ts: number | null) => {
  return useQuery(["pull", ts], () => getPull(ts), {
    retryDelay: 1,
    retry: 10,
    enabled: !!ts,
    onError: (error) => {
      console.error(error);
    },
  });
};

export { usePull, getPull };
