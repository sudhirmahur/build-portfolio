import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { optimizeImage } from '../../utils/image';
import PasswordStrength from '../../components/PasswordStrength';
import AdminIcon from '../components/AdminIcon';
import { Spinner } from '../components/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const slugify = (text) =>
  text.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const initial = {
  name: '', email: '', password: '', confirm: '', slug: '',
  title: '', location: '', phone: '', education: '', job: '',
};

function Field({ id, label, required, error, children, help }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>
      ) : (
        help && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{help}</p>
      )}
    </div>
  );
}

export default function Register() {
  const { admin, loading, register } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [form, setForm] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugState, setSlugState] = useState({ checking: false, available: null, reason: '' });
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // suggest the portfolio URL from the name until the person edits it
  useEffect(() => {
    if (!slugTouched) setForm((f) => ({ ...f, slug: slugify(f.name) }));
  }, [form.name, slugTouched]);

  // live "is this URL free?" check
  useEffect(() => {
    const slug = slugify(form.slug);
    if (slug.length < 3) {
      setSlugState({ checking: false, available: null, reason: '' });
      return undefined;
    }
    setSlugState((s) => ({ ...s, checking: true }));
    const timer = setTimeout(() => {
      api
        .get(`/auth/slug-check?slug=${encodeURIComponent(slug)}`)
        .then((res) => setSlugState({ checking: false, available: res.available, reason: res.reason }))
        .catch(() => setSlugState({ checking: false, available: null, reason: '' }));
    }, 400);
    return () => clearTimeout(timer);
  }, [form.slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }
  if (admin) return <Navigate to="/admin" replace />;

  const handleAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((e) => ({ ...e, avatar: 'Please choose an image file' }));
    if (file.size > 8 * 1024 * 1024) return setErrors((e) => ({ ...e, avatar: 'Image must be under 8 MB' }));
    setUploading(true);
    setErrors((e) => ({ ...e, avatar: undefined }));
    try {
      setAvatar(await api.upload('public-avatar', file));
    } catch (err) {
      setErrors((e) => ({ ...e, avatar: err.message }));
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    if (slugify(form.slug).length < 3) next.slug = 'Portfolio URL must be at least 3 characters';
    else if (slugState.available === false) next.slug = slugState.reason || 'This URL is not available';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        slug: slugify(form.slug),
        title: form.title.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        education: form.education.trim(),
        job: form.job.trim(),
        avatar,
      });
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const slug = slugify(form.slug);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-medium sm:text-3xl">Create your portfolio</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Fields marked <span className="text-red-400">*</span> are required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 gap-x-4 gap-y-5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:grid-cols-2 sm:p-8"
        >
          {/* photo */}
          <div className="flex items-center gap-4 sm:col-span-2">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-[var(--border)] bg-[var(--bg-elevated-2)] text-[var(--text-muted)]">
              {uploading ? (
                <Spinner />
              ) : avatar?.url ? (
                <img src={optimizeImage(avatar.url, 200)} alt="Your photo" className="h-full w-full object-cover" />
              ) : (
                <AdminIcon name="user" size={28} />
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="sr-only" tabIndex={-1} aria-label="Upload photo" />
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <AdminIcon name="upload" size={14} />
                  {avatar ? 'Change photo' : 'Upload your photo'}
                </button>
                {avatar && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      api.post('/auth/discard-avatar', { publicId: avatar.publicId }).catch(() => {});
                      setAvatar(null);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className={`mt-1.5 text-xs ${errors.avatar ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                {errors.avatar || 'Optional · JPG, PNG or WEBP · max 8 MB'}
              </p>
            </div>
          </div>

          <Field id="reg-name" label="Full name" required error={errors.name}>
            <input id="reg-name" className="field-input" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" placeholder="Your name" />
          </Field>

          <Field id="reg-email" label="Email (Gmail)" required error={errors.email}>
            <input id="reg-email" type="email" className="field-input" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@gmail.com" />
          </Field>

          <div className="sm:col-span-2">
            <Field id="reg-password" label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="field-input pr-10"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <AdminIcon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
            </Field>
            <PasswordStrength password={form.password} />
          </div>

          <div className="sm:col-span-2">
            <Field id="reg-confirm" label="Confirm password" required error={errors.confirm}>
              <input id="reg-confirm" type={showPassword ? 'text' : 'password'} className="field-input" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} autoComplete="new-password" />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field id="reg-slug" label="Your portfolio URL" required error={errors.slug}>
              <div className="flex items-stretch overflow-hidden rounded-md border border-[var(--border)] focus-within:border-[var(--accent)]">
                <span className="hidden shrink-0 items-center bg-[var(--bg-elevated-2)] px-3 text-sm text-[var(--text-muted)] sm:flex">
                  {window.location.host}/p/
                </span>
                <input
                  id="reg-slug"
                  className="min-w-0 flex-1 bg-[var(--bg)] px-3 py-2.5 text-sm outline-none"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', e.target.value);
                  }}
                  placeholder="your-name"
                />
              </div>
            </Field>
            <p className="mt-1.5 break-all text-xs text-[var(--text-muted)]">
              {slug.length >= 3 && (
                <>
                  Your link: <span className="text-[var(--accent)]">{window.location.origin}/p/{slug}</span>{' '}
                </>
              )}
              {slugState.checking && '· checking…'}
              {!slugState.checking && slugState.available === true && <span className="text-green-500">· available ✓</span>}
              {!slugState.checking && slugState.available === false && <span className="text-red-400">· {slugState.reason}</span>}
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-4 sm:col-span-2">
            <p className="text-sm font-medium">About you <span className="font-normal text-[var(--text-muted)]">(optional — you can edit all of this later)</span></p>
          </div>

          <Field id="reg-title" label="Job title / role">
            <input id="reg-title" className="field-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Full Stack Developer" />
          </Field>
          <Field id="reg-job" label="Current job">
            <input id="reg-job" className="field-input" value={form.job} onChange={(e) => set('job', e.target.value)} placeholder="Developer at Company" />
          </Field>
          <Field id="reg-education" label="Education">
            <input id="reg-education" className="field-input" value={form.education} onChange={(e) => set('education', e.target.value)} placeholder="B.Tech CSE, College name" />
          </Field>
          <Field id="reg-location" label="Location">
            <input id="reg-location" className="field-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" />
          </Field>
          <Field id="reg-phone" label="Phone">
            <input id="reg-phone" className="field-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" autoComplete="tel" />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400 sm:col-span-2">
              {serverError}
            </p>
          )}

          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary w-full" disabled={busy || uploading}>
              {busy ? 'Creating your portfolio…' : 'Create my portfolio'}
            </button>
            <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-[var(--accent)] hover:underline">Log in</Link>
            </p>
          </div>
        </form>

        <p className="mt-5 text-center text-sm">
          <Link to="/" className="text-[var(--text-muted)] hover:text-[var(--accent)]">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
