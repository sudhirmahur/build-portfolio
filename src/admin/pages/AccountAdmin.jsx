import { useState } from 'react';
import { api, setToken } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PasswordStrength from '../../components/PasswordStrength';
import { Card, PageHeader } from '../components/ui';

export default function AccountAdmin() {
  const { admin, setAdmin } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    setBusy('profile');
    try {
      const res = await api.put('/auth/me', profile);
      setAdmin(res.admin);
      toast.success('Account updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    setBusy('password');
    try {
      const res = await api.put('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.token) setToken(res.token);
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Account" description="Change your admin login details." />

      <Card className="mb-6 p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Login details</h2>
        <form onSubmit={saveProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="acc-name" className="mb-1.5 block text-sm font-medium">Name</label>
            <input id="acc-name" className="field-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="acc-email" className="mb-1.5 block text-sm font-medium">Email (used to log in)</label>
            <input id="acc-email" type="email" className="field-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={busy === 'profile'}>
              {busy === 'profile' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-medium">Change password</h2>
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="pw-current" className="mb-1.5 block text-sm font-medium">Current password</label>
            <input id="pw-current" type="password" autoComplete="current-password" className="field-input" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          </div>
          <div>
            <label htmlFor="pw-new" className="mb-1.5 block text-sm font-medium">New password</label>
            <input id="pw-new" type="password" autoComplete="new-password" className="field-input" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            <PasswordStrength password={passwords.newPassword} />
          </div>
          <div>
            <label htmlFor="pw-confirm" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
            <input id="pw-confirm" type="password" autoComplete="new-password" className="field-input" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={busy === 'password'}>
              {busy === 'password' ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
