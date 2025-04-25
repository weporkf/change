// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { runtimeConfig } from "./configs/runtimeConfig";

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxtjs/apollo", "nuxt-graphql-client", "@vueuse/nuxt", "@vee-validate/nuxt", "@element-plus/nuxt"],
  css: ["@/assets/scss/app.scss"],
  ssr: false,
  runtimeConfig,
  typescript: {
    tsConfig: {
      compilerOptions: {
        strict: true,
        verbatimModuleSyntax: false,
      },
    },
  },

  components: {
    global: true,
    dirs: ["~/components"],
  },
  app: {
    head: {
      title: "Worst-change",
      meta: [
        {
          "http-equiv": "Content-Security-Policy",
          content: "upgrade-insecure-requests",
        },
      ],
    },
  },
});
