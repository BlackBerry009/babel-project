import { transformFileSync } from "@babel/core";
import { fileURLToPath } from "url";
import myBabelPlugin from "./version4";

const __dirname = fileURLToPath(new URL("./source.js", import.meta.url));

const { code } = transformFileSync(__dirname, {
  plugins: [myBabelPlugin],
  parserOpts: {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  },
});

console.log(code)
