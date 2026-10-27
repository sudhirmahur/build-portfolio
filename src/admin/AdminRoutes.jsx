import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import { Spinner } from './components/ui';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileAdmin from './pages/ProfileAdmin';
import PagesAdmin from './pages/PagesAdmin';
import ProjectsAdmin from './pages/ProjectsAdmin';
import ExperienceAdmin from './pages/ExperienceAdmin';
import SkillsAdmin from './pages/SkillsAdmin';
import EducationAdmin from './pages/EducationAdmin';
import MessagesAdmin from './pages/MessagesAdmin';
import AccountAdmin from './pages/AccountAdmin';
import DesignAdmin from './pages/DesignAdmin';
import ResumeGallery from './pages/ResumeGallery';
import ResumeEditor from './pages/ResumeEditor';
import TemplatesAdmin from './pages/TemplatesAdmin';
import UsersAdmin from './pages/UsersAdmin';
import Register from './pages/Register';

function SuperAdminOnly({ children }) {
  const { isSuperAdmin } = useAuth();
  return isSuperAdmin ? children : <Navigate to="/admin" replace />;
}

function RequireAuth() {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <AdminLayout />;
}

// Mounted at /admin/* — the paths below are relative to /admin
export default function AdminRoutes() {
  useEffect(() => {
    document.title = 'Admin — SRN Tech';
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="pages" element={<PagesAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="education" element={<EducationAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="account" element={<AccountAdmin />} />
        <Route path="design" element={<DesignAdmin />} />
        <Route path="resume" element={<ResumeGallery />} />
        <Route path="resume/:templateId" element={<ResumeEditor />} />
        <Route path="templates" element={<TemplatesAdmin />} />
        <Route path="users" element={<SuperAdminOnly><UsersAdmin /></SuperAdminOnly>} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
