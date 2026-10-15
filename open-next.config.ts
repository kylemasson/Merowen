import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache at launch: every page is rendered per request.
export default defineCloudflareConfig({});
