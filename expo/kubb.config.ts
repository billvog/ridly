import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTanstackQuery } from "@kubb/swagger-tanstack-query";
import { pluginTs } from "@kubb/swagger-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "http://localhost:8000/api/schema/",
  },
  output: {
    path: "./types/gen",
    clean: true,
  },
  plugins: [pluginOas(), pluginTanstackQuery(), pluginTs()],
});
