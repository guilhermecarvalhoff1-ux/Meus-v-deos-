import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Os desenhos e as legendas vivem em scripts na pasta public/ (lib.js, engine.js e epN/scenes.js).
// Cada quadro pede ao motor o SVG do instante atual.
declare global {
  interface Window {
    AUREA?: { init: (words: unknown[]) => void; frame: (t: number) => string; end: number };
    __aureaEp?: string;
  }
}

export type EpisodeProps = { ep: string; audio?: boolean };

const FONTS = `
@font-face{font-family:RC;src:url(${staticFile("fonts/roboto-condensed-latin-700-normal.woff2")});font-weight:700}
@font-face{font-family:RC;src:url(${staticFile("fonts/roboto-condensed-latin-800-normal.woff2")});font-weight:800}
@font-face{font-family:RC;src:url(${staticFile("fonts/roboto-condensed-latin-900-normal.woff2")});font-weight:900}
@font-face{font-family:NU;src:url(${staticFile("fonts/nunito-latin-700-normal.woff2")});font-weight:700}
@font-face{font-family:NU;src:url(${staticFile("fonts/nunito-latin-800-normal.woff2")});font-weight:800}
@font-face{font-family:NU;src:url(${staticFile("fonts/nunito-latin-900-normal.woff2")});font-weight:900}`;

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar " + src));
    document.head.appendChild(s);
  });

const loadEngine = async (ep: string) => {
  if (window.AUREA && window.__aureaEp === ep) return;
  if (window.__aureaEp && window.__aureaEp !== ep) {
    // os scripts declaram constantes globais: um episódio por página
    throw new Error("Recarregue o Studio para trocar de episódio");
  }
  const style = document.createElement("style");
  style.textContent = FONTS;
  document.head.appendChild(style);
  await loadScript(staticFile("lib.js"));
  await loadScript(staticFile(`${ep}/scenes.js`));
  await loadScript(staticFile("upgrade.js"));
  await loadScript(staticFile("engine.js"));
  const words = await (await fetch(staticFile(`${ep}/words.json`))).json();
  window.AUREA!.init(words.words);
  await document.fonts.load("900 86px RC");
  await document.fonts.load("800 40px NU");
  window.__aureaEp = ep;
};

export const Episode: React.FC<EpisodeProps> = ({ ep, audio = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [ready, setReady] = useState(Boolean(window.AUREA && window.__aureaEp === ep));
  const [handle] = useState(() => (ready ? null : delayRender("Carregando cenas " + ep)));

  useEffect(() => {
    if (ready) return;
    loadEngine(ep)
      .then(() => {
        setReady(true);
        if (handle !== null) continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [ep, ready, handle]);

  const svg = ready ? window.AUREA!.frame(frame / fps) : "";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {audio ? <Audio src={staticFile(`${ep}/narracao.mp3`)} /> : null}
    </AbsoluteFill>
  );
};
