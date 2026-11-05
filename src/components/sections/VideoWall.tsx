import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Play, X } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { asset } from '@/lib/utils';
import { videos, type VideoSlot } from '@/data/videos';
import { useStore } from '@/store/useStore';

function VideoPopup({ video, onClose }: { video: VideoSlot; onClose: () => void }) {
  const reduceMotion = useStore((s) => s.reduceMotion);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
      className="pointer-events-none fixed inset-0 z-[100] grid place-items-center p-3 sm:p-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/28 backdrop-blur-[1px]" />
      <motion.section
        role="dialog"
        aria-modal="false"
        aria-labelledby="video-popup-title"
        className="instrument-panel pointer-events-auto relative max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto border-t-2 border-t-cyan bg-canvas shadow-2xl shadow-black/60"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="orbit-label ui-label">EP / {String(video.episode).padStart(2, '0')}</p>
            <h2 id="video-popup-title" className="truncate text-lg text-white sm:text-xl">
              {video.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className="control-surface grid h-11 w-11 shrink-0 place-items-center text-ink-soft transition hover:text-neon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&rel=0`}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-soft sm:px-6">
          {video.description}
        </p>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

function VideoCard({ video, onPlay }: { video: VideoSlot; onPlay: (video: VideoSlot) => void }) {
  const canPlay = video.status === 'live' && Boolean(video.youtubeId);
  const thumbnail = (
    <>
      <img
        src={asset(video.thumbnail)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs uppercase tracking-[0.12em] text-white">
        Episode {video.episode}
      </span>
      {canPlay ? (
        <span className="absolute right-3 top-3 rounded-full bg-neon px-2.5 py-1 text-xs font-semibold text-neon-ink">
          Watch now
        </span>
      ) : (
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
          Coming soon
        </span>
      )}
      {canPlay && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-neon text-neon-ink shadow-lg shadow-black/30 transition group-hover:scale-110"
        >
          <Play size={22} fill="currentColor" className="ml-0.5" />
        </span>
      )}
    </>
  );

  return (
    <article className="instrument-panel instrument-card overflow-hidden rounded-2xl">
      <div className="relative aspect-video overflow-hidden bg-canvas">
        {canPlay ? (
          <button
            type="button"
            onClick={() => onPlay(video)}
            aria-label={`Play episode ${video.episode}: ${video.title}`}
            className="group absolute inset-0 h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-neon"
          >
            {thumbnail}
          </button>
        ) : (
          <div className="group absolute inset-0" aria-label={`Episode ${video.episode}, coming soon`}>
            {thumbnail}
            <Qubi
              mood="curious"
              size={48}
              float={false}
              className="absolute bottom-14 right-4 drop-shadow-lg"
            />
          </div>
        )}
      </div>

      <div className="border-t border-line p-5">
        <p className="orbit-label mb-2 text-xs">ARCHIVE / EP {String(video.episode).padStart(2, '0')}</p>
        <h3 className="text-lg">{video.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{video.description}</p>
        {video.transcript && <p className="mt-3 text-xs text-muted">{video.transcript}</p>}
      </div>
    </article>
  );
}

export default function VideoWall() {
  const [activeVideo, setActiveVideo] = useState<VideoSlot | null>(null);
  const liveCount = videos.filter((video) => video.status === 'live' && video.youtubeId).length;
  const upcomingCount = videos.length - liveCount;

  return (
    <div>
      {upcomingCount > 0 && (
        <p className="mb-6 text-sm text-muted">
          {liveCount} of {videos.length} episodes are ready to watch; {upcomingCount}{' '}
          {upcomingCount === 1 ? 'episode is' : 'episodes are'} coming soon. Click a live card to
          play its video.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {activeVideo && <VideoPopup video={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>
    </div>
  );
}
