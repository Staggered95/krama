import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, CheckSquare, LogOut, User as UserIcon, Shield, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  // Initialize theme
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';

    // Fallback for older browsers (Safari/Firefox might still be catching up)
    if (!document.startViewTransition) {
      document.documentElement.setAttribute('data-theme', newTheme);
      setIsDark(!isDark);
      return;
    }

    // The Magic: Browser takes a screenshot, runs this, takes another screenshot, and animates
    document.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', newTheme);
      setIsDark(!isDark);
    });
  };

  return (
    <div className="flex h-screen bg-background-primary text-text-primary transition-colors duration-200">
      <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-accent-primary flex items-center gap-2">
            <CheckSquare /> Krama
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 p-2 rounded transition-colors ${location.pathname === '/' ? 'bg-background-hover text-text-primary' : 'text-text-muted hover:bg-background-hover hover:text-text-primary'}`}
          >
            <LayoutDashboard size={20} />
            Projects
          </Link>
          
          {/* Admin Panel Link - Strictly conditional */}
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin" 
              className={`flex items-center gap-3 p-2 rounded transition-colors ${location.pathname === '/admin' ? 'bg-background-hover text-text-primary' : 'text-text-muted hover:bg-background-hover hover:text-text-primary'}`}
            >
              <Shield size={20} />
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 mb-2 bg-background-hover/50 rounded border border-border">
            <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-background-primary font-bold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-text-primary truncate">{user?.name || 'Guest'}</span>
              <span className="text-xs text-text-muted truncate">{user?.role || 'UNKNOWN'}</span>
            </div>
          </div>

          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 p-2 w-full rounded hover:bg-background-hover text-text-muted hover:text-text-primary transition-colors text-left"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button 
            onClick={logout}
            className="flex items-center gap-3 p-2 w-full rounded hover:bg-error/10 text-error transition-colors text-left font-semibold"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-background-primary flex items-center px-6 shrink-0">
          <h2 className="text-lg font-semibold text-text-muted capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}