import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../shared/trpc";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://192.168.10.102:3000/trpc",
    }),
  ],
  transformer: superjson,
});
export default trpc;
