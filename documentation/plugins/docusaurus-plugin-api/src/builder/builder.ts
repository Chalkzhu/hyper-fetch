import * as path from "path";

import { parseToJson } from "../parser/parser";
import { asyncForEach } from "../utils/loop.utils";
import { PluginOptions } from "../types/package.types";
import { apiDocsPath } from "../constants/paths.constants";
import { success, trace } from "../utils/log.utils";
import { cleanFileName } from "../utils/file.utils";
import { apiGenerator } from "../generators/api.generator";
import { generateMonorepoPage } from "../generators/monorepo.page";
import { generatePackagePage } from "../generators/package.page";
import { addPkgMeta } from "../globals";

const builder = async (apiRootDir: string, options: PluginOptions) => {
  const { packages, tsConfigPath } = options;
  const isMonorepo = packages.length > 1;

  if (isMonorepo) {
    trace(`Generating monorepo page for ${options.packages.length} packages`);
    generateMonorepoPage(apiRootDir, options);
  }

  // Generate docs for each package
  await asyncForEach(packages, async (element) => {
    const { dir, title, entryPath, tsconfigName = "/tsconfig.json", tsconfigDir = element.dir } = element;

    // Setup
    const packageName = cleanFileName(title); // Hyper-Fetch or React-Hyper-Fetch

    // Package tsconfig file
    const tsconfigPath = tsConfigPath ?? path.join(tsconfigDir, tsconfigName);

    // Package entry file
    const entries = Array.isArray(entryPath)
      ? entryPath.map((entry) => path.join(dir, entry))
      : [path.join(dir, entryPath)];

    // Output directory
    trace(`Setup directories for ${packageName || "default"}`, packageName);
    const packageApiDir = isMonorepo ? path.join(apiRootDir, packageName) : apiRootDir; // -> /api/Hyper-Fetch(if monorepo) or /api
    const apiJsonDocsPath = path.join(packageApiDir, apiDocsPath);

    // Main Page
    trace(`Generating package page`, packageName);
    generatePackagePage(packageApiDir, element);

    // Scan and parse docs to json
    trace(`Starting project parsing.`, packageName);
    await parseToJson(apiJsonDocsPath, entries, tsconfigPath, options);
    success(`Successfully parsed docs!`, packageName);

    // Generate docs files
    const json = await import(apiJsonDocsPath);

    addPkgMeta(title.replace(/\s/g, ""), {
      docPath: apiJsonDocsPath,
      ...(options.readOnce && { file: json }),
    });

    trace(`Generating docs files...`, packageName);
    await apiGenerator(json, options, packageName, apiRootDir);
  });
  success(`Successfully builded docs!`);
};
export default builder;
