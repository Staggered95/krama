import { useState } from 'react';
import { X } from 'lucide-react';
import { projectService } from '../../services/api';

export default function ProjectAddMemberModal({ isOpen, onClose, projectId }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await projectService.addMember(projectId, email);
      setSuccess(`${res.data.user} was added successfully!`);
      setEmail(''); // Clear for another invite
      
      // Auto-close after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member. Ensure the email is registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background-secondary w-full max-w-md rounded-lg shadow-xl border border-border flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Add Team Member</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {error && <div className="text-error text-sm bg-error/10 p-2 rounded">{error}</div>}
          {success && <div className="text-emerald-500 text-sm bg-emerald-500/10 p-2 rounded">{success}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">User Email</label>
            <input
              type="email"
              required
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@krama.com"
            />
          </div>

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
              {loading ? 'Adding...' : 'Add to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}