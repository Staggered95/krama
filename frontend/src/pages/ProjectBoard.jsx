import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { issueService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import ProjectAddMemberModal from '../components/projects/ProjectAddMemberModal';
import IssueCard from '../components/board/IssueCard';
import IssueCreateModal from '../components/issues/IssueCreateModal';

export default function ProjectBoard() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const { user } = useAuth();
  const canManageMembers = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const fetchIssues = () => {
    issueService.getByProject(projectId)
      .then(res => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load issues", err);
        setError("Failed to load project board data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssues();
    
    projectService.getMembers(projectId)
      .then(res => setMembers(res.data))
      .catch(err => console.error("Failed to load project members", err));
  }, [projectId]);

  const handleStatusChange = async (issueId, newStatus) => {
    setError(null);
    try {
      await issueService.updateStatus(issueId, newStatus);
      fetchIssues();
    } catch (err) {
      console.error("Failed to update status", err);
      setError(`Failed to update issue status to ${newStatus.replace('_', ' ')}. Please try again.`);
    }
  };

  const handleAssign = async (issueId, assigneeId) => {
    if (!assigneeId) return;
    setError(null);
    try {
      await issueService.assign(issueId, assigneeId);
      fetchIssues();
    } catch (err) {
      console.error("Failed to assign user", err);
      setError("Failed to assign user. Please try again.");
    }
  };

  const columns = ['OPEN', 'IN_PROGRESS', 'CODE_REVIEW', 'RESOLVED', 'CLOSED'];
  const groupedIssues = columns.reduce((acc, status) => {
    acc[status] = issues.filter(issue => issue.status === status);
    return acc;
  }, {});

  if (loading) return <div className="p-6 text-text-muted">Loading board...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold">Project Board</h1>
        <div className="flex gap-3">
          {canManageMembers && (
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="px-4 py-2 bg-background-secondary border border-border text-text-primary rounded font-bold hover:border-accent-primary transition-colors"
            >
              + Add Member
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-accent-primary text-background-primary rounded font-bold hover:bg-accent-hover transition-colors"
          >
            + New Issue
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-4 flex justify-between items-center shadow-sm shrink-0">
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="hover:bg-error/20 p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Kanban Container with custom scrollbar styling */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map(status => (
          <div key={status} className="flex-1 min-w-[300px] bg-background-secondary rounded-lg flex flex-col border border-border shrink-0">
            <div className="p-4 border-b border-border font-bold text-text-muted flex justify-between items-center shrink-0">
              <span>{status.replace('_', ' ')}</span>
              <span className="bg-background-primary px-2 py-1 rounded-full text-xs">
                {groupedIssues[status] ? groupedIssues[status].length : 0}
              </span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
              {groupedIssues[status]?.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  members={members}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                  canAssign={canManageMembers}
                />
              ))}
              
              {(!groupedIssues[status] || groupedIssues[status].length === 0) && (
                <div className="text-center p-4 text-text-muted text-sm border-2 border-dashed border-border rounded">
                  No issues
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ProjectAddMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        projectId={projectId}
      />

      <IssueCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onIssueCreated={fetchIssues}
      />
    </div>
  );
}