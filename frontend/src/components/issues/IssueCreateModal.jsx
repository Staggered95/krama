import { useState } from 'react';
import { X } from 'lucide-react';
import { issueService } from '../../services/api';

export default function IssueCreateModal({ isOpen, onClose, projectId, onIssueCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'TASK',
    priority: 'MEDIUM',
    projectId: projectId,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await issueService.create(formData);
      onIssueCreated(res.data); // Update the UI immediately
      setFormData({ ...formData, title: '', description: '' }); // Reset form
      onClose();
    } catch (error) {
      console.error("Failed to create issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background-secondary w-full max-w-lg rounded-lg shadow-xl border border-border flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Create Issue</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Description</label>
            <textarea
              rows="3"
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-text-muted mb-1">Type</label>
              <select
                className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Feature</option>
                <option value="IMPROVEMENT">Improvement</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-text-muted mb-1">Priority</label>
              <select
                className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-text-muted hover:bg-background-hover transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-accent-primary text-background-primary font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}