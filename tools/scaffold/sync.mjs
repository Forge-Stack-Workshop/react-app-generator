import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { loadCatalog } from "./catalog.mjs";
import { enabledFeatureIds, validateConfig } from "./config.mjs";
import { buildAggregators } from "./aggregate.mjs";
import { reconcileDeps } from "./deps.mjs";
import { readState, writeState, hashContent } from "./state.mjs";
import { renderTokens, listFiles } from "./render.mjs";

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".scss",
  ".json",
  ".md",
  ".html",
  ".css",
  ".txt",
  ".yaml",
  ".yml",
]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}

function isTextFile(path) {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return false;
  return TEXT_EXTENSIONS.has(path.slice(dot).toLowerCase());
}

// Effective options for a feature: manifest defaults (feature.options)
// overridden by the user's per-feature config (config.features[id] when object).
function effectiveOptions(feature, config) {
  const userOpts = config.features?.[feature.id];
  const overrides = userOpts && typeof userOpts === "object" ? userOpts : {};
  return { ...(feature.options ?? {}), ...overrides };
}

// Option values may be arrays: JSON.stringify arrays; coerce other
// non-string scalars to their String() form so renderTokens can substitute them.
function tokensWithOptions(tokens, options) {
  const merged = { ...tokens };
  for (const [key, value] of Object.entries(options ?? {})) {
    merged[key] = Array.isArray(value) ? JSON.stringify(value) : String(value);
  }
  return merged;
}

function copyRendered(srcFile, destFile, tokens) {
  mkdirSync(dirname(destFile), { recursive: true });
  if (isTextFile(srcFile)) {
    const rendered = renderTokens(readFileSync(srcFile, "utf8"), tokens);
    writeFileSync(destFile, rendered);
    return hashContent(rendered);
  }
  cpSync(srcFile, destFile);
  return hashContent(readFileSync(destFile));
}

function deleteIfHashMatches(destFile, recordedHash, force, warnings, label) {
  if (!existsSync(destFile)) return; // already gone
  const current = hashContent(readFileSync(destFile));
  if (current === recordedHash || force) {
    rmSync(destFile);
    return;
  }
  warnings.push(`${label} was edited; not deleting (use --force)`);
}

export function sync({ projectDir, featuresDir, config, tokens, force = false }) {
  const catalog = loadCatalog(featuresDir);
  validateConfig(config, catalog.map((c) => c.id));

  const enabledIds = new Set(enabledFeatureIds(config));
  const enabled = catalog.filter((c) => enabledIds.has(c.id));

  const prev = readState(projectDir);
  const prevFeatures = prev.features ?? {};

  const added = [];
  const removed = [];
  const warnings = [];
  const nextFeatures = {};

  // Step 4: add newly-enabled features (id order for determinism).
  for (const feature of enabled) {
    if (prevFeatures[feature.id]) {
      // Already present: carry its recorded state forward, refreshed below.
      continue;
    }
    const srcRoot = join(featuresDir, feature.id, "files");
    const featureTokens = tokensWithOptions(tokens, effectiveOptions(feature, config));
    const files = {};
    for (const rel of listFiles(srcRoot)) {
      const hash = copyRendered(join(srcRoot, rel), join(projectDir, rel), featureTokens);
      files[rel] = hash;
    }
    nextFeatures[feature.id] = { files, deps: feature.deps ?? [], devDeps: feature.devDeps ?? [] };
    added.push(feature.id);
  }

  // Step 5: remove features that were present but are no longer enabled.
  for (const id of Object.keys(prevFeatures)) {
    if (enabledIds.has(id)) continue;
    const rec = prevFeatures[id];
    for (const [rel, recordedHash] of Object.entries(rec.files ?? {})) {
      deleteIfHashMatches(join(projectDir, rel), recordedHash, force, warnings, `${id}/${rel}`);
    }
    removed.push(id);
  }

  // Step 6: write aggregators (overwrite; ensure parent dirs exist).
  for (const [rel, content] of Object.entries(buildAggregators(enabled))) {
    const dest = join(projectDir, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content);
  }

  // Step 7: reconcile package.json dependencies.
  const pkgPath = join(projectDir, "package.json");
  const pkg = readJson(pkgPath);
  pkg.dependencies ??= {};
  pkg.devDependencies ??= {};
  reconcileDeps(pkg, enabled, prev);
  writeJson(pkgPath, pkg);

  // Step 8: rebuild state.features so it holds exactly the enabled set with
  // current file hashes + deps/devDeps, then persist.
  const state = { ...prev, features: {} };
  for (const feature of enabled) {
    if (nextFeatures[feature.id]) {
      state.features[feature.id] = nextFeatures[feature.id];
      continue;
    }
    const rec = prevFeatures[feature.id] ?? { files: {} };
    const files = {};
    for (const rel of Object.keys(rec.files ?? {})) {
      const dest = join(projectDir, rel);
      files[rel] = existsSync(dest) ? hashContent(readFileSync(dest)) : rec.files[rel];
    }
    state.features[feature.id] = {
      files,
      deps: feature.deps ?? [],
      devDeps: feature.devDeps ?? [],
    };
  }
  writeState(projectDir, state);

  // Step 9: return sorted results.
  return { added: added.sort(), removed: removed.sort(), warnings };
}
