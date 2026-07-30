import { useState } from 'react';
import { ArrowUp, ArrowRight, ArrowDown, AlertCircle, History } from 'lucide-react';
import IssueHistoryModal from './IssueHistoryModal';

export default function IssueCard({ issue, members = [], onStatusChange, onAssign, canAssign }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'CRITICAL': return <AlertCircle size={16} className="text-error" />;
      case 'HIGH': return <ArrowUp size={16} className="text-error" />;
      case 'MEDIUM': return <ArrowRight size={16} className="text-warning" />;
      case 'LOW': return <ArrowDown size={16} className="text-success" />;
      default: return <ArrowRight size={16} />;
    }
  };

  return (
    <>
      <div className="bg-background-secondary p-3 rounded shadow-sm border border-border hover:border-accent-primary transition-colors mb-3 group">
        <p className="text-sm font-medium text-text-primary mb-3 line-clamp-2">{issue.title}</p>
        
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex gap-2">
            <select 
              value={issue.status}
              onChange={(e) => onStatusChange(issue.id, e.target.value)}
              className="flex-1 text-xs bg-background-primary border border-border text-text-muted rounded p-1 focus:outline-none focus:border-accent-primary hover:text-text-primary transition-colors cursor-pointer"
              title="Status"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CODE_REVIEW">Code Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select 
              value={issue.assigneeId || ''}
              onChange={(e) => onAssign(issue.id, e.target.value)}
              disabled={!canAssign} // <-- Disabled for standard developers
              className={`flex-1 text-xs bg-background-primary border border-border text-text-muted rounded p-1 focus:outline-none focus:border-accent-primary transition-colors ${canAssign ? 'hover:text-text-primary cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
              title={canAssign ? "Assignee" : "Only Managers can change assignee"}
            >
              <option value="" disabled>Unassigned</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider bg-background-hover px-2 py-1 rounded text-text-muted font-bold">
              {issue.type}
            </span>
            {getPriorityIcon(issue.priority)}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="text-text-muted hover:text-accent-primary transition-colors p-1 rounded hover:bg-background-hover"
              title="View History"
            >
              <History size={16} />
            </button>
            <div 
              className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center text-[10px] font-bold text-background-primary cursor-help" 
              title={`Reporter: ${issue.reporterName || 'System'}`}
            >
              {issue.reporterName ? issue.reporterName.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        </div>
      </div>
      
      <IssueHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        issue={issue} 
      />
    </>
  );
}