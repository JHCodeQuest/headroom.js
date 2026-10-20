import { readFileSync } from "node:fs";
import terser from "@rollup/plugin-terser";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
const banner = `/*! ${pkg.name} v${pkg.version} - ${pkg.description}\n * Copyright (c) Nick Williams and contributors. License: MIT; see LICENSE. */`;

export default {
  input: "src/Headroom.js",
  output: [
    { file: "dist/headroom.js", format: "umd", name: "Headroom", banner },
    {
      file: "dist/headroom.min.js", format: "umd", name: "Headroom", banner,
      plugins: [terser({ format: { comments: /^!/ } })]
    },
    { file: "dist/headroom.mjs", format: "es", banner }
  ]
};
