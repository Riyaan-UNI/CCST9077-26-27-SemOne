import Page from '@/components/Page';
import EvidenceLedger from '@/components/cases/EvidenceLedger';

export default function EvidenceLedgerPage() {
  return (
    <Page>
      <div className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Case conference / evidence ledger</p>
        <h1 className="record-title mt-4 max-w-3xl">Compare what each case can tell us.</h1>
        <p className="record-lead mt-5 max-w-2xl">
          The shared word “information” points to different questions in each file. Read the
          findings side by side, then compare them with the prediction, confidence and test observation you saved.
        </p>
        <div className="mt-10"><EvidenceLedger /></div>
      </div>
    </Page>
  );
}
