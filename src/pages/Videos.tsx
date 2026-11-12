import Page from '@/components/Page';
import VideoWall from '@/components/sections/VideoWall';

export default function Videos() {
  return (
    <Page>
      <section className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8" aria-labelledby="videos-title">
        <p className="record-kicker">Moving evidence / hosted by Qubi</p>
        <h1 id="videos-title" className="record-title mt-4 max-w-3xl">The video records</h1>
        <p className="record-lead mt-5 max-w-2xl">
          Three episodes are ready to play. Episode four is forthcoming. Choose a live record to
          load its YouTube player; captions and transcript availability should be checked by the group.
        </p>
        <div className="mt-10"><VideoWall /></div>
      </section>
    </Page>
  );
}
