import Page from '@/components/Page';
import Section from '@/components/Section';
import VideoWall from '@/components/sections/VideoWall';

export default function Videos() {
  return (
    <Page>
      <Section
        eyebrow="Watch"
        title="The video series"
        lead="Four short episodes hosted by Qubi. Three are ready to watch, and one is coming soon. Videos load only when you click a card."
      >
        <VideoWall />
      </Section>
    </Page>
  );
}
