import { mkdir, readFile, writeFile } from "node:fs/promises";

// One source declaration, with the appropriate export for each module format.
const source = await readFile(new URL("../src/Headroom.d.ts", import.meta.url), "utf8");
await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
for (const extension of ["ts", "mts", "cts"]) {
  const content = extension === "cts"
    ? source.replace("export default Headroom;", "export = Headroom;")
    : source;
  await writeFile(new URL(`../dist/headroom.d.${extension}`, import.meta.url), content);
}
