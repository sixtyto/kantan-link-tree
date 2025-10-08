import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "nuxt-auth-utils", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Kantan Link Tree - The easiest way to share all your links",
      meta: [
        {
          name: "description",
          content:
            "Create a beautiful, personalized link tree in minutes. Perfect for social media bios, business cards, and anywhere you need to share multiple links.",
        },
        { name: "format-detection", content: "telephone=no" },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:site_name",
          content: "Kantan Link Tree",
        },
        {
          property: "og:title",
          content: "Kantan Link Tree - The easiest way to share all your links",
        },
        {
          property: "og:description",
          content:
            "Create a beautiful, personalized link tree in minutes. Perfect for social media bios, business cards, and anywhere you need to share multiple links.",
        },
        {
          property: "og:image",
          content: "/og-image.png",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: "Kantan Link Tree - The easiest way to share all your links",
        },
        {
          name: "twitter:description",
          content:
            "Create a beautiful, personalized link tree in minutes. Perfect for social media bios, business cards, and anywhere you need to share multiple links.",
        },
        {
          name: "twitter:image",
          content: "/og-image.png",
        },
        { name: "author", content: "Piotr Czajkowski" },
        {
          name: "keywords",
          content:
            "link tree, link in bio, social media links, bio links, link aggregator, custom links, personal landing page",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://kantan-link-tree.vercel.app" },
      ],
    },
  },
});
