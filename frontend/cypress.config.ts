import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", 
    setupNodeEvents(on, config) {},
    supportFile: "cypress/support/e2e.ts",
    env: {
      apiUrl: "http://localhost:5000", 
    },
  },

  defaultCommandTimeout: 10000,
  viewportWidth: 1280,
  viewportHeight: 720,

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
