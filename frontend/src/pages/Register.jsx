import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.register(formData);
      const { token, userId, name, role } = res.data;
      // Instantly log the user in with the returned token
      login({ userId, name, role }, token); 
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="w-full max-w-md bg-background-secondary p-8 rounded-lg shadow-xl border border-border">
        <div className="flex flex-col items-center mb-8">
          <CheckSquare size={48} className="text-accent-primary mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">Create an Account</h1>
        </div>

        {error && (
          <div className="bg-error/20 text-error p-3 rounded mb-4 text-sm text-center border border-error/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1">Password</label>
            <input 
              type="password" 
              required 
              minLength="6"
              className="w-full bg-background-primary border border-border rounded p-2 text-text-primary focus:outline-none focus:border-accent-primary"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent-primary text-background-primary font-bold py-2 rounded mt-2 hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-accent-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}