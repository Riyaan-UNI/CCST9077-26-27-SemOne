import { Link } from 'react-router-dom';
import { bureauCases } from '@/content/cases';
import { useStore } from '@/store/useStore';

export default function EvidenceLedger() {
  const entries = useStore((state) => state.caseLedger);

  return (
    <div className="ledger-wrap" aria-label="Evidence ledger">
      <div className="ledger-table-scroll" tabIndex={0} aria-label="Scrollable evidence comparison">
        <table className="ledger-table">
          <caption>Case findings and visitor predictions saved on this device</caption>
          <thead>
            <tr>
              <th scope="col">Case</th>
              <th scope="col">Working finding</th>
              <th scope="col">Your prediction</th>
              <th scope="col">Test observation</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="record-note mt-4">Your predictions stay in this browser. They are not sent to a server.</p>
    </div>
  );
}
