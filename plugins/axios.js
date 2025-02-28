import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase, // Ensure this is defined in your nuxt.config.ts
  });

  return {
    provide: {
      axios: api,
    },
  };
});
