/**
 * Descarga iconos Phosphor usados en index.html y reemplaza <iconify-icon> por SVG inline
 * (currentColor) para PDF/offline idéntico al navegador.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pitchDir = path.resolve(__dirname, "..");
const htmlPath = path.join(pitchDir, "index.html");
const iconsDir = path.join(pitchDir, "icons", "ph");

const ICON_RE = /<iconify-icon\s+icon="ph:([^"]+)"(?:\s+class="([^"]*)")?\s*><\/iconify-icon>/g;

function normalizeSvg(svg, className) {
  let s = svg.trim();
  s = s.replace(/\s(width|height)="[^"]*"/gi, "");
  s = s.replace(/\sfill="[^"]*"/gi, "");
  s = s.replace(/<svg/, '<svg fill="currentColor" aria-hidden="true"');
  const cls = ["pitch-icon", className].filter(Boolean).join(" ");
  if (/\sclass="/i.test(s)) {
    s = s.replace(/\sclass="[^"]*"/i, ` class="${cls}"`);
  } else {
    s = s.replace("<svg", `<svg class="${cls}"`);
  }
  return s;
}

async function fetchIcon(name) {
  const url = `https://api.iconify.design/ph/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const html = await fs.readFile(htmlPath, "utf8");
  const names = new Set();
  let m;
  const re = new RegExp(ICON_RE.source, "g");
  while ((m = re.exec(html)) !== null) names.add(m[1]);

  await fs.mkdir(iconsDir, { recursive: true });
  const cache = new Map();
  for (const name of [...names].sort()) {
    const file = path.join(iconsDir, `${name}.svg`);
    let raw;
    try {
      raw = await fs.readFile(file, "utf8");
    } catch {
      console.log("fetch", name);
      raw = await fetchIcon(name);
      await fs.writeFile(file, raw, "utf8");
    }
    cache.set(name, raw);
  }

  const patched = html.replace(ICON_RE, (_, name, className) =>
    normalizeSvg(cache.get(name), className)
  );

  if (patched === html) {
    console.log("Sin cambios en HTML (¿ya parcheado?)");
    return;
  }

  await fs.writeFile(htmlPath, patched, "utf8");
  console.log(`OK: ${names.size} iconos → inline SVG en index.html`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
