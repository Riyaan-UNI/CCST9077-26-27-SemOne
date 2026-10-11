import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import Qubi from '@/components/Qubi';
import { videos } from '@/data/videos';

/**
 * Video wall. Coming-soon slots show a branded CRT-static "Signal incoming…"
 * card with Qubi peeking in. Live slots load a privacy-friendly (nocookie)
 * YouTube facade only on click, so the page stays fast and makes no third-party
 * requests until the viewer asks for one.
 */
export default function VideoWall() {
  const hasUpcoming = videos.some((v) => v.status !== 'live');
  return (
    <div>
      {hasUpcoming && (
        <p className="mb-6 text-sm text-muted">
          All five episodes are coming soon. Click a card to load its video when ready.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <article
          key={v.id}
          className="h-full overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong"
        >
          <div className="relative aspect-video w-full bg-[#070b09]">
            {v.status === 'live' && v.youtubeId ? (
              <LiteYouTubeEmbed
                id={v.youtubeId}
                title={v.title}
                poster="hqdefault"
                noCookie
                wrapperClass="lyt-wrapper h-full"
                iframeClass="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="crt-lines absolute inset-0 grid place-items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
                <div className="relative flex flex-col items-center gap-2 px-4 text-center">
                  <span className="ui-label text-hype-amber">Signal incoming…</span>
                  <Qubi mood="curious" size={88} float={false} />
                  <p className="max-w-[16rem] text-sm text-muted">{v.title}</p>
                </div>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full border border-line bg-canvas/80 px-2.5 py-1 text-xs uppercase tracking-[0.12em] text-neon">
              Ep {v.episode}
            </span>
            {v.status === 'live' && (
              <span className="absolute right-3 top-3 rounded-full bg-neon px-2.5 py-1 text-xs font-semibold text-neon-ink">
                Live
              </span>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
            <p className="mt-3 text-xs text-muted">{v.transcript}</p>
          </div>
        </article>
      ))}
      </div>
    </div>
  );
}
