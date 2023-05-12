import { useMutation } from "@tanstack/react-query";
import request from "@/services/request";

const submitText = async (text = "") => {
  const parsed: { ts: number } = await request("/api/cleanup", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  return parsed;
};

const useCleanup = (text: string) => {
  return useMutation({
    mutationKey: ["cleanup"],
    mutationFn: () => submitText(text),
    onError: (error) => {
      console.error(error);
    },
  });
};

export { useCleanup, submitText };
