import { Composition, Folder } from "remotion";
import { Episode } from "./Episode";

const FPS = 30;

// Cada episódio: pasta public/epN com scenes.js, words.json e narracao.mp3
const EPISODES = [{ id: "AureaEp1", ep: "ep1", seconds: 74.6 }];

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
          defaultProps={{ ep: e.ep }}
        />
      ))}
    </Folder>
  );
};
