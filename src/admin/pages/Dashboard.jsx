import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';
import AdminIcon from '../components/AdminIcon';
import { Badge, Card, PageHeader, Spinner } from '../components/ui';

const tiles = [
  { key: 'projects', label: 'Projects', to: '/admin/projects', icon: 'folder' },
  { key: 'experience', label: 'Experience', to: '/admin/experience', icon: 'briefcase' },
  { key: 'skillCategories', label: 'Skill categories', to: '/admin/skills', icon: 'code' },
  { key: 'education', label: 'Education', to: '/admin/education', icon: 'book' },
  { key: 'pages', label: 'Pages', to: '/admin/pages', icon: 'pages' },
  { key: 'messages', label: 'Messages', to: '/admin/messages', icon: 'inbox' },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const portfolioUrl = admin?.portfolio ? `${window.location.origin}/p/${admin.portfolio.slug}` : '';
  const stats = useFetch('/admin/stats');
  const [cloudinaryOk, setCloudinaryOk] = useState(true);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setCloudinaryOk(res.cloudinary !== false))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome back${admin?.name ? `, ${admin.name}` : ''}`}
        description="Manage everything on your portfolio from here. Changes go live immediately."
        actions={
          <Link to={admin?.portfolio ? `/p/${admin.portfolio.slug}` : "/"} target="_blank" className="btn btn-outline">
            <AdminIcon name="external" size={15} />
            View my portfolio
          </Link>
        }
      />

      {portfolioUrl && (
        <Card className="mb-6 p-4 text-sm">
          <p className="font-medium">Your public portfolio link</p>
          <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-[var(--accent)] hover:underline">
            {portfolioUrl}
          </a>
          {!admin.portfolio.published && <p className="mt-1 text-xs text-red-400">Unpublished — only you can see this. Publish it under “Design & link”.</p>}
        </Card>
      )}

      {!cloudinaryOk && (
        <Card className="mb-6 border-red-500/50 p-4 text-sm">
          <p className="font-medium text-red-400">Cloudinary is not configured</p>
          <p className="mt-1 text-[var(--text-muted)]">
            Image and resume uploads will fail until you add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and
            CLOUDINARY_API_SECRET to the backend <code>.env</code> file and restart the server.
          </p>
        </Card>
      )}

      {stats.loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={28} />
        </div>
      ) : stats.error ? (
        <Card className="p-6 text-center text-sm text-red-400">{stats.error.message}</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <Link key={tile.key} to={tile.to} className="group">
                <Card className="flex items-center gap-4 p-4 transition-colors group-hover:border-[var(--accent)]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-elevated-2)] text-[var(--accent)]">
                    <AdminIcon name={tile.icon} size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-none">{stats.data[tile.key]}</span>
                    <span className="mt-1 block text-sm text-[var(--text-muted)]">
                      {tile.label}
                      {tile.key === 'messages' && stats.data.unread > 0 && (
                        <span className="ml-2 align-middle">
                          <Badge tone="accent">{stats.data.unread} new</Badge>
                        </span>
                      )}
                    </span>
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <h2 className="mb-3 mt-10 font-display text-lg font-medium">Recent messages</h2>
          {stats.data.recent.length === 0 ? (
            <Card className="p-6 text-center text-sm text-[var(--text-muted)]">No messages yet.</Card>
          ) : (
            <Card>
              <ul className="divide-y divide-[var(--border)]">
                {stats.data.recent.map((message) => (
                  <li key={message._id} className="flex items-start gap-3 p-3 sm:p-4">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${message.read ? 'bg-[var(--border)]' : 'bg-[var(--accent)]'}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {message.name} <span className="font-normal text-[var(--text-muted)]">· {message.email}</span>
                      </p>
                      <p className="truncate text-sm text-[var(--text-muted)]">{message.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[var(--border)] p-3 text-right">
                <Link to="/admin/messages" className="text-sm text-[var(--accent)] hover:underline">
                  Open inbox →
                </Link>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
