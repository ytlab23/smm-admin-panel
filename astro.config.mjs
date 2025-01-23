import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

let site = "https://smm-admin.vercel.app/"
// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // site: 'http://localhost:4321',
  // site: 'https://smm-reviews-panel-v2.vercel.app/',
  site: 'https://smm-admin-panel.vercel.app/',
  // site: 'https://smm-admin-phi.vercel.app/',
  output: "server",
  adapter: vercel()
});
