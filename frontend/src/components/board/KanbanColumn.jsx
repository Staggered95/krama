import IssueCard from './IssueCard';

export default function KanbanColumn({ title, issues, onStatusChange }) {
  return (
    <div className="flex flex-col bg-background-hover/50 rounded-lg w-72 min-w-[18rem] max-h-full">
      <div className="p-3 flex items-center justify-between border-b border-border">
        <h3 className="font-semibold text-text-muted text-sm">{title}</h3>
        <span className="text-xs font-bold bg-background-secondary px-2 py-1 rounded-full">
          {issues.length}
        </span>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        {issues.map(issue => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            onStatusChange={onStatusChange} // <-- Pass it down again
          />
        ))}
        {issues.length === 0 && (
          <div className="border-2 border-dashed border-border rounded p-4 text-center text-text-muted text-sm mt-2">
            No issues
          </div>
        )}
      </div>
    </div>
  );
}