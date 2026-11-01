// Adds Vercel Web Analytics + Speed Insights tags to every built HTML page (idempotent).
const fs = require("fs");
const path = require("path");
const TAGS =
  '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script>\n' +
  '<script defer src="/_vercel/insights/script.js"></script>\n' +
  '<script>window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments)};</script>\n' +
  '<script defer src="/_vercel/speed-insights/script.js"></script>\n';
const SKIP = new Set(["node_modules", ".git", "research", "scripts"]);
let n = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) {
      const s = fs.readFileSync(p, "utf8");
      if (s.includes("/_vercel/insights/script.js") || !s.includes("</body>")) continue;
      const i = s.lastIndexOf("</body>");
      fs.writeFileSync(p, s.slice(0, i) + TAGS + s.slice(i));
      n++;
    }
  }
})(process.cwd());
console.log(`inject-vercel-insights: ${n} pages updated`);
