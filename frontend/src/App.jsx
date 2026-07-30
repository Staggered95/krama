import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layouts/AppLayout';
import ProjectList from './pages/ProjectList';
import ProjectBoard from './pages/ProjectBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

// A wrapper component that checks for auth
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// We extract the routes into a separate component so AuthProvider wraps the Router correctly
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<ProjectList />} />
        <Route path="project/:projectId" element={<ProjectBoard />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;