export function splitPackage(spec) {
  const at = spec.lastIndexOf("@");
  return at > 0 ? [spec.slice(0, at), spec.slice(at + 1)] : [spec, "latest"];
}

function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}

export function reconcileDeps(pkg, enabledFeatures, prevState) {
  const enabledIds = new Set(enabledFeatures.map((f) => f.id));
  const stillRequired = new Set();
  for (const f of enabledFeatures) {
    for (const spec of [...(f.deps ?? []), ...(f.devDeps ?? [])]) stillRequired.add(splitPackage(spec)[0]);
  }
  // add enabled
  for (const f of enabledFeatures) {
    for (const spec of f.deps ?? []) { const [n, r] = splitPackage(spec); pkg.dependencies[n] = r; }
    for (const spec of f.devDeps ?? []) { const [n, r] = splitPackage(spec); pkg.devDependencies[n] = r; }
  }
  // remove deps owned only by now-disabled features
  for (const [id, rec] of Object.entries(prevState.features ?? {})) {
    if (enabledIds.has(id)) continue;
    for (const spec of rec.deps ?? []) {
      const [n] = splitPackage(spec);
      if (!stillRequired.has(n)) delete pkg.dependencies[n];
    }
    for (const spec of rec.devDeps ?? []) {
      const [n] = splitPackage(spec);
      if (!stillRequired.has(n)) delete pkg.devDependencies[n];
    }
  }
  pkg.dependencies = sortObject(pkg.dependencies);
  pkg.devDependencies = sortObject(pkg.devDependencies);
  return pkg;
}
