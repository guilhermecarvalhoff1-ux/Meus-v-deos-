// uso: node render.js preview <saida_dir> [indices]  |  node render.js frames <saida_dir> <inicio> <fim> <fps>
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const SITE = path.join(__dirname, 'site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, r) => {
      const f = path.join(SITE, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/index.html'));
      fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
    }).listen(0, () => res(srv));
  });
}
(async () => {
  const [mode, out, a, b, fpsArg] = process.argv.slice(2);
  const PQ = process.env.PART ? '?p=' + process.env.PART : '';
  fs.mkdirSync(out, { recursive: true });
  const srv = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERR', e.message)); page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/index.html${PQ}`);
  await page.evaluate(() => window.ready);
  if (mode === 'preview') {
    const times = await page.evaluate(() => SCENES.map((s, i) => { const e = SCENES[i + 1] ? SCENES[i + 1].s : END; return s.s + (e - s.s) * 0.6; }));
    const only = a ? a.split(',').map(Number) : null;
    for (let i = 0; i < times.length; i++) {
      if (only && !only.includes(i + 1)) continue;
      await page.evaluate(t => render(t), times[i]);
      await page.screenshot({ path: path.join(out, `s${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    }
  } else {
    const fps = Number(fpsArg || 30), f0 = Number(a), f1 = Number(b);
    for (let f = f0; f < f1; f++) {
      await page.evaluate(t => render(t), f / fps);
      await page.screenshot({ path: path.join(out, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
  }
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
