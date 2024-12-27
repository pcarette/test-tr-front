// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: "SafeRoad",
      meta: [
        {
          name: "description",
          content: "A simple quiz website built with Nuxt.js",
        },
      ],
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      BASE_API_URL: process.env.BASE_API_URL || "http://localhost:5005",
    },
  },
});
