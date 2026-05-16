import { QueryClient } from "@tanstack/react-query";

const API_BASE =
  typeof window !== "undefined" && (window as any).__PORT_5000__
    ? (window as any).__PORT_5000__
    : "";

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const path = queryKey[0] as string;
        const res = await fetch(`${API_BASE}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      },
      retry: false,
      staleTime: 30_000,
    },
  },
});
