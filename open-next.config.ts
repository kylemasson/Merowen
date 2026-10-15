import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Pages render on request (fresh prices and stock from Shopify), so no
// incremental cache is needed. To add ISR later, attach an R2 bucket and use
// the R2 incremental cache override — see README.
export default defineCloudflareConfig({});
