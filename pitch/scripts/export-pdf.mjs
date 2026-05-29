/**
 * Exporta pitch/index.html → PDF local + copia al repo web (presentacion-pitch.pdf).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pitchDir = path.resolve(__dirname, "..");
const webRoot = path.resolve(pitchDir, "..");
const html = path.join(pitchDir, "index.html");
const pdfLocal = path.join(pitchDir, "index.pdf");
const pdfRepo = path.join(webRoot, "presentacion-pitch.pdf");
const uri = "file:///" + html.replace(/\\/g, "/");

const chromePaths = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const chrome = chromePaths.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Instala Chrome/Edge o define CHROME_PATH");
  process.exit(1);
}

const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=15000",
  `--print-to-pdf=${pdfLocal}`,
  uri,
];

const child = spawn(chrome, args, { stdio: "inherit" });
child.on("close", (code) => {
  if (code !== 0) process.exit(code ?? 1);
  fs.copyFileSync(pdfLocal, pdfRepo);
  const kb = (fs.statSync(pdfRepo).size / 1024).toFixed(0);
  console.log(`Local:  ${pdfLocal}`);
  console.log(`Repo:   ${pdfRepo} (${kb} KB)`);
});
