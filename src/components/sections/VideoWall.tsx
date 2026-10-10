import { useMemo, useState } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/Reveal';
import { videoTags, videos } from '@/data/videos';
import { useStore } from '@/store/useStore';

/**
 * Video wall. Nothing is requested from YouTube until a viewer clicks a card —
 * the facade keeps the page fast and avoids third-party requests on load.
 */
export default function VideoWall() {
  const [tag, setTag] = useState('All');
  const react = useStore((s) => s.react);

  const shown = useMemo(
    () => (tag === 'All' ? videos : videos.filter((v) => v.tag === tag)),
    [tag],
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter videos by topic">
        {videoTags.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tag === t}
            onClick={() => {
              setTag(t);
              react('curious', `Filtering for ${t}.`);
            }}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm transition',
              tag === t
                ? 'border-neon bg-neon text-neon-ink'
                : 'border-line text-ink-soft hover:border-line-strong hover:text-neon',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((video, i) => (
          <Reveal key={video.id} delay={i * 0.04}>
            <article className="h-full overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong">
              <div className="relative aspect-video w-full bg-[#070b09]">
                {video.youtubeId ? (
                  <LiteYouTubeEmbed
                    id={video.youtubeId}
                    title={video.title}
                    poster="hqdefault"
                    noCookie
                    wrapperClass="lyt-wrapper h-full"
                    iframeClass="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <div className="crt-lines absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <PlayCircle size={34} className="text-neon" aria-hidden="true" />
                      <p className="ui-label text-muted">
                        Video slot — add a YouTube id
                      </p>
                      <p className="max-w-[16rem] text-sm text-muted">
                        Set <code className="text-neon">youtubeId</code> in{' '}
                        <code className="text-neon">src/data/videos.ts</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className="ui-label text-neon">
                  {video.tag}
                </span>
                <h3 className="mt-2 text-lg">{video.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{video.blurb}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
