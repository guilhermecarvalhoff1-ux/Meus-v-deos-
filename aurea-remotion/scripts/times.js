// Calcula o início de cada cena (mesma lógica do motor) para posicionar os sons
const fs = require('fs'), vm = require('vm'), path = require('path');
const P = process.argv[2];
const ctx = vm.createContext({ window: {}, console, Math, JSON });
for (const f of ['lib.js', 'ep1/scenes.js', 'engine.js']) vm.runInContext(fs.readFileSync(path.join(P, f), 'utf8'), ctx, { filename: f });
vm.runInContext(`window.AUREA.init(${fs.readFileSync(path.join(P, 'ep1/words.json'), 'utf8')}.words);`, ctx);
console.log(JSON.stringify(vm.runInContext(`SCENES.map(s => ({ k: s.k || null, gap: s.gap ?? null, s: s.s }))`, ctx)));
