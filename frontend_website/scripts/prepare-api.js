const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../");
const backendSrc = path.join(repoRoot, "backend", "src");
const dest = path.join(__dirname, "../netlify/functions/api/backend");

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(backendSrc, dest, { recursive: true });

console.log(`[prepare-api] copied backend/src -> ${path.relative(process.cwd(), dest)}`);
