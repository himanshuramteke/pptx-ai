import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processTask } from "@/inngest/function";

export const { GET, PUT, POST } = serve({
  client: inngest,
  functions: [processTask],
});
