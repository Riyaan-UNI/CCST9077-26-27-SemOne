import Page from '@/components/Page';
import Section from '@/components/Section';
import VideoWall from '@/components/sections/VideoWall';

export default function Videos() {
  return (
    <Page>
      <Section
        eyebrow="Watch"
        title="The video series"
        lead="Five short episodes hosted by Qubi. Cards load only when you click, so nothing is fetched from YouTube until you ask. Titles are working drafts and will change."
      >
        <VideoWall />
      </Section>
    </Page>
  );
}
