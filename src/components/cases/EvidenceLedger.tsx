import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bureauCases } from '@/content/cases';
import { useStore } from '@/store/useStore';
import { useProgression } from '@/features/progression/ProgressionProvider';

export default function EvidenceLedger() {
  const entries = useStore((state) => state.caseLedger);
  const { progress } = useProgression();
  const [readAnyway, setReadAnyway] = useState(false);
  const unread = bureauCases.filter((item) => !entries[item.id]?.findingRead);
  const showLedger = progress.observerMode || unread.length === 0 || readAnyway;

  return (
    <div className="ledger-wrap" aria-label="Evidence ledger">
      {!showLedger && (
        <section className="conference-unlock" aria-labelledby="conference-reading-title">
          <p className="record-kicker">Case conference / reading room</p>
          <h2 id="conference-reading-title">Read all three findings for the full comparison.</h2>
          <p>The conference is open now, but the side-by-side review is most useful after the files are read. Remaining: {unread.map((item) => item.topic).join('; ')}.</p>
          <ul>{unread.map((item) => <li key={item.id}><Link to={`/cases/${item.id}`}>Read Case {item.number}: {item.topic}</Link></li>)}</ul>
          <button type="button" className="record-button mt-4" onClick={() => setReadAnyway(true)}>Read the comparison anyway</button>
        </section>
      )}
      {showLedger && <>
      <div className="ledger-table-scroll" tabIndex={0} aria-label="Scrollable evidence comparison">
        <table className="ledger-table">
          <caption>Case findings and visitor predictions saved on this device</caption>
          <thead>
            <tr>
              <th scope="col">Case</th>
              <th scope="col">Working finding</th>
              <th scope="col">Your prediction</th>
              <th scope="col">Test observation</th>
              <th scope="col" className="progression-chrome">Confidence</th>
              <th scope="col" className="progression-chrome">Finding read</th>
            </tr>
          </thead>
          <tbody>
            {bureauCases.map((item) => (
              <tr key={item.id}>
                <th scope="row">
                  <Link to={`/cases/${item.id}`} className="ledger-case-link">
                    <span className="record-case-number">{item.number}</span>
                    <span>{item.topic}</span>
                  </Link>
                </th>
                <td>{item.finding}</td>
                <td>{entries[item.id]?.prediction || <span className="record-muted">Not recorded</span>}</td>
                <td>{entries[item.id]?.observation || <span className="record-muted">Not tested</span>}</td>
                <td className="progression-chrome">{entries[item.id]?.prediction ? `${entries[item.id]?.confidence ?? 3} / 5` : <span className="record-muted">Not set</span>}</td>
                <td className="progression-chrome">{entries[item.id]?.findingRead ? 'Read' : <span className="record-muted">Not read</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="record-note mt-4">Your predictions stay in this browser. They are not sent to a server.</p>
      </>}
    </div>
  );
}
