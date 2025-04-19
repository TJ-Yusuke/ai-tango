import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../shared/trpc";
import Constants from "expo-constants";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${Constants.expoConfig?.extra?.API_BASE_URL}/trpc`,
      headers: {
        Authorization: `Bearer ${Constants.expoConfig?.extra?.API_SECRET_KEY}`,
      },
    }),
  ],
  transformer: superjson,
});
export default trpc;
