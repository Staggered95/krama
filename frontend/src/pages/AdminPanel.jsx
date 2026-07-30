import { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Double check on frontend just in case
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = () => {
    userService.getAll()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch users", err);
        setLoading(false);
      });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateRole(userId, newRole);
      // Update local state to reflect change instantly
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  if (loading) return <div className="p-6 text-text-muted">Loading users...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <ShieldAlert className="text-accent-primary" size={28} />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <div className="bg-background-secondary rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-hover/50 border-b border-border">
              <th className="p-4 font-semibold text-text-muted text-sm">ID</th>
              <th className="p-4 font-semibold text-text-muted text-sm">Name</th>
              <th className="p-4 font-semibold text-text-muted text-sm">Email</th>
              <th className="p-4 font-semibold text-text-muted text-sm">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-background-hover/30">
                <td className="p-4 text-text-muted">#{u.id}</td>
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="p-4 text-text-muted">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.id === user.userId} // Cannot downgrade yourself!
                    className="bg-background-primary border border-border rounded p-1 text-sm text-text-primary focus:outline-none focus:border-accent-primary disabled:opacity-50"
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}