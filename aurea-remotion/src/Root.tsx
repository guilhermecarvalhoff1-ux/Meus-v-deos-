import { Composition, Folder } from "remotion";
import { Episode } from "./Episode";

const FPS = 30;

// Cada episódio: pasta public/epN com scenes.js, words.json e narracao.mp3
// audio: false = sem narração (a narração será gravada depois)
const EPISODES = [
  { id: "AureaEp1", ep: "ep1", seconds: 102.4, audio: true },
  // ep2: ainda sem narração (ver NARRAR_AUREA_EP2.md); depois de gravar, ajustar seconds e audio: true
  { id: "AureaEp2", ep: "ep2", seconds: 99.6, audio: false },
];

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Aurea">
      {EPISODES.map((e) => (
        <Composition
          key={e.id}
          id={e.id}
          component={Episode}
          durationInFrames={Math.round(e.seconds * FPS)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ ep: e.ep, audio: e.audio }}
        />
      ))}
    </Folder>
  );
};
