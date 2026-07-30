import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService, issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Clock } from 'lucide-react';
import ProjectCreateModal from '../components/projects/ProjectCreateModal';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const canCreateProjects = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const fetchDashboardData = () => {
    Promise.all([
      projectService.getAll(),
      issueService.getMyIssues()
    ])
      .then(([projRes, issueRes]) => {
        setProjects(projRes.data);
        setMyIssues(issueRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setError("Could not load dashboard data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-text-muted">Loading dashboard...</div>;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Projects */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          {canCreateProjects && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-accent-primary text-background-primary rounded font-bold hover:bg-accent-hover transition-colors"
            >
              + New Project
            </button>
          )}
        </div>

        {error && <div className="text-error mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full p-6 border-2 border-dashed border-border rounded text-center text-text-muted">
              No projects available.
            </div>
          ) : (
            projects.map((project, index) => (
              <Link 
                key={project.id || `proj-${index}`}
                to={`/project/${project.id}`}
                className="bg-background-secondary p-5 rounded-lg border border-border hover:border-accent-primary transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <LayoutDashboard className="text-text-muted group-hover:text-accent-primary transition-colors" size={24} />
                  <h3 className="text-lg font-bold text-text-primary">{project.name}</h3>
                </div>
                <p className="text-sm text-text-muted line-clamp-2">{project.description}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Assigned Tasks */}
      <div className="w-full lg:w-96 flex flex-col bg-background-secondary rounded-lg border border-border overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-background-hover/30">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CheckSquare className="text-accent-primary" size={20} />
            My Assigned Tasks
          </h2>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
          {myIssues.length === 0 ? (
            <div className="text-center p-4 text-text-muted text-sm border-2 border-dashed border-border rounded">
              No tasks assigned to you right now.
            </div>
          ) : (
            myIssues.map((issue, index) => (
              <Link 
                key={issue.id || `issue-${index}`}
                to={`/project/${issue.projectId}`}
                className="block bg-background-primary p-3 rounded border border-border hover:border-accent-primary transition-colors"
              >
                <p className="text-sm font-semibold text-text-primary mb-2 line-clamp-2">{issue.title}</p>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase tracking-wider bg-background-hover px-2 py-1 rounded text-text-muted font-bold">
                    {issue.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock size={12} />
                    <span className="truncate max-w-[100px]">{issue.projectName}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <ProjectCreateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={() => {
          // Rely entirely on the backend fetch to prevent duplicate key race conditions
          fetchDashboardData(); 
        }}
      />

    </div>
  );
}