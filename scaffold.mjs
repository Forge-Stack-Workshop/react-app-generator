#!/usr/bin/env node
// scaffold.mjs — Forge-Stack React Template scaffolder
// Usage: node scaffold.mjs
// Reads template.yaml, prompts interactively, generates the project.

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  cpSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { parseYaml } from "./tools/scaffold/yaml.mjs";
import { readConfig, writeConfig } from "./tools/scaffold/config.mjs";
import { sync } from "./tools/scaffold/sync.mjs";
import { copyBase } from "./tools/scaffold/base.mjs";

// ── Colours ──────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const bold = (s) => `${c.bold}${s}${c.reset}`;
const dim = (s) => `${c.dim}${s}${c.reset}`;
const cyan = (s) => `${c.cyan}${s}${c.reset}`;
const green = (s) => `${c.green}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const red = (s) => `${c.red}${s}${c.reset}`;
const blue = (s) => `${c.blue}${s}${c.reset}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));

function mkdir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function write(p, content) {
  mkdir(dirname(p));
  writeFileSync(p, content, "utf8");
}

function ask(rl, question) {
  return rl.question(`  ${cyan("?")} ${bold(question)} `);
}

async function confirm(rl, question, defaultVal = true) {
  const hint = defaultVal ? dim("[Y/n]") : dim("[y/N]");
  const ans = await ask(rl, `${question} ${hint}: `);
  if (!ans.trim()) return defaultVal;
  return ans.trim().toLowerCase().startsWith("y");
}

async function select(rl, question, choices) {
  console.log(`\n  ${cyan("?")} ${bold(question)}`);
  choices.forEach((c, i) =>
    console.log(`  ${dim(`${i + 1}.`)} ${c.label ?? c}`),
  );
  const ans = await ask(rl, `Enter number (default 1): `);
  const idx = parseInt(ans.trim(), 10);
  if (isNaN(idx) || idx < 1 || idx > choices.length) return choices[0];
  return choices[idx - 1];
}

async function multiSelect(rl, question, choices) {
  console.log(
    `\n  ${cyan("?")} ${bold(question)} ${dim("(comma-separated numbers, Enter = all defaults)")}`,
  );
  choices.forEach((c, i) => {
    const def = c.default !== false ? green("✓") : dim("○");
    console.log(
      `  ${def} ${dim(`${i + 1}.`)} ${bold(c.name ?? c.id)} ${dim("—")} ${c.description ?? ""}`,
    );
  });
  const ans = await ask(rl, `Selection: `);
  if (!ans.trim()) return choices.filter((c) => c.default !== false);
  return ans
    .split(",")
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < choices.length)
    .map((i) => choices[i]);
}

// ── Banner ────────────────────────────────────────────────────────────────────
function printBanner(meta) {
  console.log(`
${c.cyan}╔══════════════════════════════════════════════════╗
║        ${bold("Forge-Stack React Scaffolder")}          ║
║  ${dim(`v${meta.version} — ${meta.description}`)}
╚══════════════════════════════════════════════════╝${c.reset}
`);
}

// ── Config-file generators (used by fresh generation) ───────────────────────────

function splitPackage(spec) {
  // "@scope/pkg@version" or "pkg@version"
  const match = spec.match(/^(@?[^@]+)@(.+)$/);
  if (match) return [match[1], match[2]];
  return [spec, "latest"];
}

function genViteConfig(config) {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
`;
}

function genTsConfigApp() {
  return JSON.stringify(
    {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        types: ["vite/client"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        erasableSyntaxOnly: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
      },
      include: ["src"],
    },
    null,
    2,
  );
}

function genTsConfigNode() {
  return JSON.stringify(
    {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        target: "ES2022",
        lib: ["ES2022"],
        module: "ESNext",
        moduleResolution: "bundler",
        skipLibCheck: true,
        noEmit: true,
        strict: true,
      },
      include: ["vite.config.ts"],
    },
    null,
    2,
  );
}

function genTsConfig() {
  return JSON.stringify(
    {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" },
      ],
    },
    null,
    2,
  );
}

function genEslintConfig() {
  return `import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
`;
}

// ── CLI flags ─────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
${bold("Forge-Stack React Scaffolder")}

${bold("Usage:")}
  node scaffold.mjs                 Interactive project generation
  node scaffold.mjs --out DIR --name NAME --features a,b,c
                                     Non-interactive fresh generation of a
                                     complete, installable project
  node scaffold.mjs --sync          Sync features into an existing project
                                     (reads forge.config.yaml)

${bold("Options:")}
  --help           Show this help message and exit
  --out <dir>      Target project directory (fresh-gen: created; --sync: default cwd)
  --name <name>    Project name for fresh generation (default: my-app)
  --features <a,b,c> Comma-separated feature ids to enable for fresh generation
                    (e.g. i18n,theming,mock,auth,dataTable,notifications,forms)
  --sync           Non-interactive: read forge.config.yaml and sync enabled
                    features into the project (add/remove files, reconcile deps)
  --force          Overwrite locally-edited files instead of warning and skipping
`);
}

function parseFlags(argv) {
  const flags = {
    help: false,
    sync: false,
    force: false,
    out: undefined,
    name: undefined,
    features: undefined,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg === "--sync") flags.sync = true;
    else if (arg === "--force") flags.force = true;
    else if (arg === "--out") flags.out = argv[++i];
    else if (arg === "--name") flags.name = argv[++i];
    else if (arg === "--features") flags.features = argv[++i];
  }
  return flags;
}

// Read code-convention tokens (apiBaseUrl, timeout) from template.yaml.
function readManifestConventions() {
  let apiBaseUrl = "/api";
  let timeout = "8000";
  const manifestPath = join(__dir, "template.yaml");
  if (existsSync(manifestPath)) {
    const manifest = parseYaml(readFileSync(manifestPath, "utf8"));
    if (manifest.conventions?.apiBaseUrl) {
      apiBaseUrl = manifest.conventions.apiBaseUrl;
    }
    if (manifest.conventions?.timeout) {
      timeout = String(manifest.conventions.timeout);
    }
  }
  return { apiBaseUrl, timeout };
}

// Shared core for both fresh generation and --sync: copy templates/base,
// then run the feature sync engine (features + aggregators + dep reconcile).
function copyBaseAndSync({ projectDir, config, tokens, force }) {
  const featuresDir = join(__dir, "templates", "features");
  if (!existsSync(featuresDir)) {
    console.log(
      yellow(
        `⚠  templates/features not found at ${featuresDir} — nothing to sync yet.`,
      ),
    );
    return undefined;
  }

  const baseDir = join(__dir, "templates", "base");
  if (existsSync(baseDir)) {
    const baseResult = copyBase({ projectDir, baseDir, tokens, force });
    console.log(
      green("✓") +
        ` Base skeleton: ${baseResult.written.length} written, ${baseResult.skipped.length} skipped`,
    );
  } else {
    console.log(
      yellow(
        `⚠  templates/base not found at ${baseDir} — skipping base skeleton copy.`,
      ),
    );
  }

  const result = sync({ projectDir, featuresDir, config, tokens, force });

  console.log(green("✓") + " Sync complete");
  console.log(
    `  ${dim("Added:")}   ${result.added.length ? result.added.join(", ") : dim("(none)")}`,
  );
  console.log(
    `  ${dim("Removed:")} ${result.removed.length ? result.removed.join(", ") : dim("(none)")}`,
  );
  for (const w of result.warnings) {
    console.log(`  ${yellow("⚠")} ${w}`);
  }
  return result;
}

// Build a package.json seeded with the BASE deps/devDeps from template.yaml.
// Feature deps are added afterwards by sync's reconcileDeps.
function genBasePackageJson(projectName) {
  const manifestPath = join(__dir, "template.yaml");
  const manifest = existsSync(manifestPath)
    ? parseYaml(readFileSync(manifestPath, "utf8"))
    : {};
  const deps = Object.fromEntries(
    (manifest.dependencies ?? []).map((d) => splitPackage(d)),
  );
  const devDeps = Object.fromEntries(
    (manifest.devDependencies ?? []).map((d) => splitPackage(d)),
  );
  const pkg = {
    name: projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      lint: "eslint .",
      preview: "vite preview",
    },
    dependencies: Object.fromEntries(Object.entries(deps).sort()),
    devDependencies: Object.fromEntries(Object.entries(devDeps).sort()),
  };
  return JSON.stringify(pkg, null, 2) + "\n";
}

// Shared fresh-generation core used by BOTH the non-interactive `--features`
// path and the no-flag interactive path. Writes a COMPLETE, installable project
// (package.json seeded from template.yaml base deps, tsconfig*, vite/eslint
// config, forge.config.yaml) then runs the shared base-copy + sync core so the
// generated app actually builds. `features` is a list of feature ids.
function freshGenCore({ projectDir, projectName, packageManager, features, force }) {
  mkdir(projectDir);

  write(join(projectDir, "package.json"), genBasePackageJson(projectName));
  write(join(projectDir, "vite.config.ts"), genViteConfig());
  write(join(projectDir, "tsconfig.json"), genTsConfig());
  write(join(projectDir, "tsconfig.app.json"), genTsConfigApp());
  write(join(projectDir, "tsconfig.node.json"), genTsConfigNode());
  write(join(projectDir, "eslint.config.js"), genEslintConfig());

  const featuresConfig = {};
  for (const id of features) {
    // Every feature is enabled as a plain boolean; no feature currently takes
    // config options (i18n ships fr/en statically — see docs/features.md).
    featuresConfig[id] = true;
  }
  const config = {
    project: projectName,
    packageManager,
    features: featuresConfig,
  };
  writeConfig(join(projectDir, "forge.config.yaml"), config);

  const tokens = { projectName, ...readManifestConventions() };

  console.log(`\n${bold("Generating project...")}`);
  console.log(`  ${dim("Project:")}  ${cyan(projectName)}`);
  console.log(`  ${dim("Output:")}   ${cyan(projectDir)}`);
  console.log(`  ${dim("Features:")} ${cyan(features.join(", ") || "(none)")}`);

  copyBaseAndSync({ projectDir, config, tokens, force });
  return config;
}

// Non-interactive fresh generation entry (`--features`/`--name`).
async function runFreshGen({ out, name, features, force }) {
  const projectName = name || "my-app";
  const projectDir = resolve(process.cwd(), out);

  try {
    freshGenCore({
      projectDir,
      projectName,
      packageManager: "pnpm",
      features,
      force,
    });
    console.log(`\nRun: ${bold(`cd ${projectDir} && pnpm install`)}`);
  } catch (err) {
    console.error(red("✗ Generation failed:"), err.message);
    process.exitCode = 1;
  }
}

async function runSync({ out, force }) {
  const projectDir = out ? resolve(process.cwd(), out) : process.cwd();
  const configPath = join(projectDir, "forge.config.yaml");

  try {
    const config = readConfig(configPath);
    const tokens = { projectName: config.project, ...readManifestConventions() };
    copyBaseAndSync({ projectDir, config, tokens, force });
    console.log(`\nRun: ${bold(`${config.packageManager} install`)}`);
  } catch (err) {
    console.error(red("✗ Sync failed:"), err.message);
    process.exitCode = 1;
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    printHelp();
    return;
  }

  if (flags.sync) {
    await runSync({ out: flags.out, force: flags.force });
    return;
  }

  // Non-interactive fresh generation: triggered by --features (and/or --name).
  if (flags.features !== undefined || flags.name !== undefined) {
    if (!flags.out) {
      console.error(red("✗ --out <dir> is required for fresh generation."));
      process.exit(1);
    }
    const features = (flags.features ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await runFreshGen({
      out: flags.out,
      name: flags.name,
      features,
      force: flags.force,
    });
    return;
  }

  // Load manifest
  const manifestPath = join(__dir, "template.yaml");
  if (!existsSync(manifestPath)) {
    console.error(red(`✗ template.yaml not found at ${manifestPath}`));
    process.exit(1);
  }
  const manifest = parseYaml(readFileSync(manifestPath, "utf8"));

  const rl = createInterface({ input, output });

  printBanner(manifest.meta ?? { version: "1.0.0", description: "" });

  // 1. Project name
  const projectName =
    (await ask(rl, `Project name ${dim("(default: my-app)")}: `)).trim() ||
    "my-app";

  if (!/^[a-z][a-z0-9_-]*$/.test(projectName)) {
    console.log(
      yellow("⚠  Project name should be lowercase with hyphens. Continuing..."),
    );
  }

  // 2. Output directory
  const defaultOut = resolve(process.cwd(), projectName);
  const outAnswer = (
    await ask(rl, `Output directory ${dim(`(default: ${defaultOut})`)}: `)
  ).trim();
  const outputDir = outAnswer ? resolve(process.cwd(), outAnswer) : defaultOut;

  if (existsSync(outputDir)) {
    const overwrite = await confirm(
      rl,
      `${yellow("⚠")} Directory already exists. Overwrite?`,
      false,
    );
    if (!overwrite) {
      console.log(dim("Aborted."));
      rl.close();
      process.exit(0);
    }
  }

  // 3. Package manager
  const pmChoice = await select(rl, "Package manager", [
    { label: "npm" },
    { label: "pnpm" },
    { label: "yarn" },
    { label: "bun" },
  ]);
  const pm = pmChoice.label;

  // 4. Features
  const availableFeatures = manifest.features ?? [];
  const selectedFeatures = await multiSelect(
    rl,
    "Select features to enable",
    availableFeatures,
  );
  const featureIds = selectedFeatures.map((f) => f.id ?? f);

  // 5. Confirm
  console.log(`\n${bold("Configuration summary:")}`);
  console.log(`  ${dim("Project:")}  ${cyan(projectName)}`);
  console.log(`  ${dim("Output:")}   ${cyan(outputDir)}`);
  console.log(`  ${dim("Features:")} ${cyan(featureIds.join(", ") || "(none)")}`);

  const go = await confirm(rl, "Generate project?", true);
  rl.close();

  if (!go) {
    console.log(dim("Aborted."));
    process.exit(0);
  }

  // 6. Generate — SAME fresh-generation core as the non-interactive path.
  try {
    freshGenCore({
      projectDir: outputDir,
      projectName,
      packageManager: pm,
      features: featureIds,
      force: flags.force,
    });
    console.log(green("✓") + " Files written");
  } catch (err) {
    console.error(red("✗ Generation failed:"), err.message);
    process.exit(1);
  }

  // 7. Install MSW worker if mock enabled
  if (featureIds.includes("mock")) {
    console.log(`${bold("Initializing MSW Service Worker...")}`);
    try {
      execSync(
        `${pm === "npm" ? "npx" : pm + " exec"} msw init public/ --save`,
        {
          cwd: outputDir,
          stdio: "inherit",
        },
      );
    } catch {
      console.log(
        yellow(
          "⚠  Could not auto-init MSW. Run manually: npx msw init public/ --save",
        ),
      );
    }
  }

  // 9. Install deps
  const install = await (async () => {
    const rl2 = createInterface({ input, output });
    const ans = await confirm(
      rl2,
      `Install dependencies with ${bold(pm)}?`,
      true,
    );
    rl2.close();
    return ans;
  })();

  if (install) {
    console.log(`\n${bold(`Running ${pm} install...`)}`);
    try {
      execSync(`${pm} install`, { cwd: outputDir, stdio: "inherit" });
      console.log(green("✓") + " Dependencies installed");
    } catch {
      console.log(red("✗") + " Install failed. Run it manually.");
    }
  }

  // 10. Done
  console.log(`
${green("✓")} ${bold("Project ready!")}

  ${dim("cd")} ${cyan(outputDir)}
  ${dim("npm run dev")}
`);
}

main().catch((err) => {
  console.error(red("✗ Fatal error:"), err.message);
  process.exit(1);
});
