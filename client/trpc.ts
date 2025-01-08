import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../shared/trpc";

export const trpc = createTRPCReact<AppRouter>();

const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
  transformer: superjson,
});

export default client;
