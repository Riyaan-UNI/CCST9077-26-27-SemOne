import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, Play, X } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { asset } from '@/lib/utils';
import { videos, type VideoSlot } from '@/data/videos';
import { useStore } from '@/store/useStore';
import { useProgression } from '@/features/progression/ProgressionProvider';
import { getQuizForEpisode } from '@/content/episodeQuizzes';
import { artworks } from '@/content/artworks';

const timestampNow = () => Date.now();

function VideoPopup({ video, onClose, returnTo }: { video: VideoSlot; onClose: () => void; returnTo?: string }) {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const { progress } = useProgression();

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
      className="bureau-video-popup-shell pointer-events-none fixed inset-0 z-[100] grid place-items-center p-3 sm:p-6"
    >
      <div aria-hidden="true" className="bureau-video-popup-backdrop pointer-events-none absolute inset-0" />
      <motion.section
        role="dialog"
        aria-modal="false"
        aria-labelledby="video-popup-title"
        className="bureau-video-popup instrument-panel pointer-events-auto relative max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto border-t-2 border-t-cyan bg-canvas shadow-2xl shadow-black/60"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="orbit-label ui-label">EP / {String(video.episode).padStart(2, '0')}</p>
            <h2 id="video-popup-title" className="truncate text-lg text-ink sm:text-xl">
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

        <section className="border-t border-line px-4 py-3 sm:px-6" aria-label="Episode notes">
          <p className="record-kicker mb-1">Episode notes</p>
          <p className="text-sm leading-relaxed text-ink-soft">{video.description}</p>
        </section>
        {!progress.observerMode && <EpisodeStampCheck videoId={video.id} onClose={onClose} returnTo={returnTo} />}
      </motion.section>
    </motion.div>,
    document.body,
  );
}

function EpisodeStampCheck({ videoId, onClose, returnTo }: { videoId: string; onClose: () => void; returnTo?: string }) {
  const { progress, dispatch } = useProgression();
  const reduceMotion = useStore((s) => s.reduceMotion);
  const questions = getQuizForEpisode(videoId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const passed = progress.episodes[videoId]?.status === 'quizPassed';
  const unlockedForEpisode = artworks.filter((plate) => plate.unlockEpisodeId === videoId);
  if (!questions.length) return null;

  const checkAnswers = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChecked(true);
    const allCorrect = questions.every((question) => answers[question.id] === question.correctIndex);
    if (allCorrect) {
      dispatch({ type: 'passQuiz', id: videoId, artworkIds: unlockedForEpisode.map((plate) => plate.id), at: timestampNow() });
      if (!reduceMotion) {
        confetti({
          particleCount: 72,
          spread: 62,
          startVelocity: 30,
          origin: { y: 0.72 },
          colors: ['#ff8756', '#9bacff', '#c5ed7a', '#f5f6f8'],
          disableForReducedMotion: true,
        });
      }
    }
  };
  const allCorrect = questions.every((question) => answers[question.id] === question.correctIndex);

  return (
    <section className="stamp-check progression-chrome" aria-labelledby="stamp-check-title">
      <div className="stamp-check-heading"><span className="record-kicker">Gallery unlock check</span><h3 id="stamp-check-title">Stamp this file</h3><p>Answer these three questions to open the linked sealed plates. No penalty; you can retry.</p></div>
      {passed ? <div className="stamp-success" role="status">
        <div>
          <strong>File complete — {unlockedForEpisode.length} {unlockedForEpisode.length === 1 ? 'plate is' : 'plates are'} now open.</strong>
          <p>Your newly declassified visuals are waiting on the Gallery Wall.</p>
        </div>
        <Link to={returnTo ? `/gallery#${encodeURIComponent(returnTo)}` : '/gallery'} onClick={onClose} className="record-button">{returnTo ? 'Open the file you selected' : 'See the unlocked plates'} <ArrowRight size={16} aria-hidden="true" /></Link>
      </div> : (
        <form onSubmit={checkAnswers}>
          {questions.map((question, questionIndex) => (
            <fieldset className="stamp-question" key={question.id}>
              <legend><span>0{questionIndex + 1}</span>{question.prompt}</legend>
              {question.options.map((option, optionIndex) => (
                <label key={option} className="stamp-option">
                  <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} />
                  {option}
                </label>
              ))}
              {checked && answers[question.id] !== question.correctIndex && <p className="stamp-explanation">Review: {question.explanation}</p>}
              {checked && answers[question.id] === question.correctIndex && <p className="stamp-correct">Correct</p>}
              <p className="stamp-source">{question.sourceLecture} · {question.reviewStatus === 'needs-review' ? 'Needs human review' : 'Reviewed'}</p>
            </fieldset>
          ))}
          {checked && !allCorrect && <p className="stamp-retry-note" role="status">Some answers need another look. Nothing was lost; adjust your choices and try again.</p>}
          <button type="submit" className="record-button mt-4" disabled={questions.some((question) => answers[question.id] === undefined)}>{checked ? 'Check again' : 'Check answers'}</button>
        </form>
      )}
    </section>
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
    <article id={video.id} className="bureau-video-record instrument-panel instrument-card overflow-hidden">
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

      <div className="bureau-video-copy border-t border-line p-5">
        <p className="orbit-label mb-2 text-xs">VIDEO RECORD / EP {String(video.episode).padStart(2, '0')}</p>
        <h3 className="text-lg">{video.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{video.description}</p>
        {video.transcript && <p className="mt-3 text-xs text-muted">{video.transcript}</p>}
        <Link to={`/cases/${video.caseId}`} className="video-next-step mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neon hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon">
          Next: explore the {video.caseLabel} case <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function VideoWall() {
  const [selectedVideo, setSelectedVideo] = useState<VideoSlot | null>(null);
  const { dispatch } = useProgression();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedVideoId = searchParams.get('play');
  const requestedReturnId = searchParams.get('returnTo');
  const returnTo = artworks.some((plate) => plate.id === requestedReturnId) ? requestedReturnId ?? undefined : undefined;
  const requestedVideo = videos.find((video) => video.id === requestedVideoId && video.status === 'live' && video.youtubeId);
  const activeVideo = selectedVideo ?? requestedVideo ?? null;
  const liveCount = videos.filter((video) => video.status === 'live' && video.youtubeId).length;
  const upcomingCount = videos.length - liveCount;

  useEffect(() => {
    if (!requestedVideo) return;
    dispatch({ type: 'markWatched', id: requestedVideo.id, at: Date.now() });
  }, [dispatch, requestedVideo]);

  const closePlayer = () => {
    setSelectedVideo(null);
    if (requestedVideoId) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('play');
      nextParams.delete('returnTo');
      setSearchParams(nextParams, { replace: true });
    }
  };

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
          <VideoCard key={video.id} video={video} onPlay={(selected) => {
            dispatch({ type: 'markWatched', id: selected.id, at: Date.now() });
            setSelectedVideo(selected);
          }} />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {activeVideo && <VideoPopup video={activeVideo} onClose={closePlayer} returnTo={returnTo} />}
      </AnimatePresence>
    </div>
  );
}
