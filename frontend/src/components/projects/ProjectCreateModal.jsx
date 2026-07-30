import { useState } from 'react';
import { X } from 'lucide-react';
import { projectService } from '../../services/api';

export default function ProjectCreateModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await projectService.create(formData);
      onProjectCreated(res.data); // Update the UI immediately
      setFormData({ name: '', description: '' }); // Reset form
      onClose();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Make sure you have the right permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background-secondary w-full max-w-md rounded-lg shadow-xl border border-border flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Create New Project</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {error && <div className="text-error text-sm bg-error/10 p-2 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Project Name</label>
            <input
              type="text"
              required
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Krama MVP"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Description</label>
            <textarea
              rows="3"
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this project about?"
            ></textarea>
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
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}