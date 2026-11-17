"""Renderiza um episódio do Áurea (motor SVG) sem Remotion, via Chrome headless.
uso: python3 render.py <public_dir> <ep> stills <t1,t2,...> <out_dir>
     python3 render.py <public_dir> <ep> video <t0> <t1> <out.mp4>
"""
import sys, os, subprocess, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright

pub, ep, mode = sys.argv[1], sys.argv[2], sys.argv[3]
FPS = 30

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=pub)
Handler.log_message = lambda *a: None
srv = socketserver.TCPServer(("127.0.0.1", 0), Handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{port}"

HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:RC;src:url({base}/fonts/roboto-condensed-latin-700-normal.woff2);font-weight:700}}
@font-face{{font-family:RC;src:url({base}/fonts/roboto-condensed-latin-800-normal.woff2);font-weight:800}}
@font-face{{font-family:RC;src:url({base}/fonts/roboto-condensed-latin-900-normal.woff2);font-weight:900}}
@font-face{{font-family:NU;src:url({base}/fonts/nunito-latin-700-normal.woff2);font-weight:700}}
@font-face{{font-family:NU;src:url({base}/fonts/nunito-latin-800-normal.woff2);font-weight:800}}
@font-face{{font-family:NU;src:url({base}/fonts/nunito-latin-900-normal.woff2);font-weight:900}}
html,body{{margin:0;background:#000}}</style></head><body>
<svg id="v" width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"></svg>
<script charset="utf-8" src="{base}/lib.js"></script><script charset="utf-8" src="{base}/{ep}/scenes.js"></script>
<script charset="utf-8" src="{base}/upgrade.js"></script><script charset="utf-8" src="{base}/engine.js"></script>
<script>
window.ready=(async()=>{{const w=await (await fetch('{base}/{ep}/words.json')).json();AUREA.init(w.words);
await document.fonts.load('900 86px RC');await document.fonts.load('800 40px NU');return AUREA.end;}})();
window.show=t=>{{document.getElementById('v').innerHTML=AUREA.frame(t);}};
</script></body></html>"""

with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = br.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.route(f"{base}/index.html", lambda r: r.fulfill(body=HTML, content_type="text/html"))
    pg.goto(f"{base}/index.html")
    try: end = pg.evaluate("window.ready")
    except Exception as e: print(errs); raise
    for e in errs: print("ERRO JS:", e, file=sys.stderr)
    if mode == "stills":
        ts, out = [float(x) for x in sys.argv[4].split(",")], sys.argv[5]
        os.makedirs(out, exist_ok=True)
        for t in ts:
            pg.evaluate(f"show({t})")
            pg.screenshot(path=f"{out}/t{t:06.2f}.jpg", type="jpeg", quality=90)
        print("end", end)
    else:
        t0, t1, outp = float(sys.argv[4]), min(float(sys.argv[5]), end), sys.argv[6]
        tmp = outp[:-4] + ".tmp.mp4"
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
        n0, n1 = round(t0 * FPS), round(t1 * FPS)
        for n in range(n0, n1):
            pg.evaluate(f"show({n / FPS})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
        ff.stdin.close()
        if ff.wait() == 0: os.replace(tmp, outp); print("ok", outp, n1 - n0, "quadros")
        else: sys.exit("ffmpeg falhou")
    for e in errs[1:] if False else []: pass
    br.close()
