import { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';
import { issueService } from '../../services/api';

export default function IssueHistoryModal({ isOpen, onClose, issue }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && issue?.id) {
      setLoading(true);
      issueService.getHistory(issue.id)
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load history", err);
          setLoading(false);
        });
    }
  }, [isOpen, issue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background-secondary w-full max-w-lg rounded-lg shadow-xl border border-border flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="text-accent-primary" size={20} />
            <h2 className="text-lg font-bold text-text-primary">Issue History</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <h3 className="font-semibold text-text-primary mb-4">{issue?.title}</h3>
          
          {loading ? (
            <div className="text-text-muted text-sm">Loading audit trail...</div>
          ) : history.length === 0 ? (
            <div className="text-text-muted text-sm border-2 border-dashed border-border p-4 rounded text-center">
              No history recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="flex gap-3 text-sm">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5"></div>
                    <div className="w-px h-full bg-border my-1"></div>
                  </div>
                  
                  {/* Event Data */}
                  <div className="pb-4">
                    <p className="text-text-primary">
                      <span className="font-bold">{record.userName}</span> changed <span className="font-semibold capitalize">{record.fieldChanged}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono bg-background-primary p-2 rounded border border-border">
                      <span className="text-error line-through">{record.oldValue}</span>
                      <span className="text-text-muted">→</span>
                      <span className="text-success">{record.newValue}</span>
                    </div>
                    <span className="text-xs text-text-muted mt-1 block">
                      {new Date(record.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}