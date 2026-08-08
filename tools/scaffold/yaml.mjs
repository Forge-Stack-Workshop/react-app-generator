// ── YAML parser (no external deps) ──────────────────────────────────────────
// Minimal subset parser: handles the structure used in template.yaml.
// For complex YAML (anchors, multiline, etc.) install js-yaml instead.
export function parseYaml(text) {
  const lines = text.split("\n");
  const root = {};
  const stack = [{ indent: -1, obj: root }];

  for (let raw of lines) {
    const line = raw.replace(/\s*#.*$/, ""); // strip inline comments
    if (!line.trim()) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    // Pop stack to current indent level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;

    if (content.startsWith("- ")) {
      // List item
      const value = content.slice(2).trim();
      const key = stack[stack.length - 1].listKey;
      if (key && Array.isArray(parent[key])) {
        // Nested object item (key: value in list)
        if (value.includes(": ")) {
          const [k, v] = value.split(/:\s+/, 2);
          const item = {};
          parent[key].push(item);
          stack.push({ indent, obj: item });
          item[k.trim()] = parseValue(v.trim());
        } else {
          parent[key].push(parseValue(value));
        }
      } else {
        // Bare list under a key
        const listParent = stack[stack.length - 2]?.obj ?? root;
        const lk = stack[stack.length - 1].listKey;
        if (lk) {
          if (!Array.isArray(listParent[lk])) listParent[lk] = [];
          if (value.includes(": ")) {
            const [k, v] = value.split(/:\s+/, 2);
            const item = {};
            listParent[lk].push(item);
            stack.push({ indent, obj: item });
            item[k.trim()] = parseValue(v.trim());
          } else {
            listParent[lk].push(parseValue(value));
          }
        }
      }
      continue;
    }

    if (content.includes(":")) {
      const colonIdx = content.indexOf(":");
      const key = content.slice(0, colonIdx).trim();
      const rest = content.slice(colonIdx + 1).trim();

      if (rest === "" || rest === "|" || rest === ">") {
        // Object or block — prepare container
        const child = {};
        if (Array.isArray(parent)) {
          parent.push(child);
        } else {
          parent[key] = child;
        }
        stack.push({ indent, obj: child, listKey: key });
      } else if (rest === "[]") {
        parent[key] = [];
        stack.push({ indent, obj: parent, listKey: key });
      } else {
        parent[key] = parseValue(rest);
        stack.push({ indent, obj: parent, listKey: key });
      }
    }
  }

  return root;
}

function parseValue(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v.replace(/^["']|["']$/g, "");
}
