import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ninedegrees.my",
  trailingSlash: "ignore",
  build: {
    inlineStylesheets: "auto",
  },
  image: {
    domains: ["images.unsplash.com"],
  },
});
