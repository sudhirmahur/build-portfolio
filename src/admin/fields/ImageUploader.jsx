import { useRef, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { optimizeImage } from '../../utils/image';
import AdminIcon from '../components/AdminIcon';
import { Spinner } from '../components/ui';

const LIMITS = { image: 8, file: 10 }; // MB, must match the backend

/** Uploads to Cloudinary through the backend and stores { url, publicId, resourceType, fileName }. */
export default function ImageUploader({ value, onChange, kind = 'image', folder = 'misc', id }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const hasValue = Boolean(value?.url);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > LIMITS[kind] * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${LIMITS[kind]} MB.`);
      return;
    }
    setBusy(true);
    try {
      const uploaded = await api.upload(kind, file, folder);
      onChange(uploaded);
      toast.success('Uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-elevated-2)] sm:w-40">
        {busy ? (
          <Spinner />
        ) : hasValue && kind === 'image' ? (
          <img src={optimizeImage(value.url, 400)} alt="Preview" className="h-full w-full object-cover" />
        ) : hasValue ? (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-w-full flex-col items-center gap-1 px-2 text-center text-xs text-[var(--accent)] hover:underline"
          >
            <AdminIcon name="file" size={24} />
            <span className="max-w-full truncate">{value.fileName || 'View file'}</span>
          </a>
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-[var(--text-muted)]">
            <AdminIcon name={kind === 'image' ? 'image' : 'file'} size={22} />
            No {kind === 'image' ? 'image' : 'file'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={kind === 'image' ? 'image/*' : '.pdf,.doc,.docx,application/pdf'}
          onChange={handleFile}
          className="sr-only"
          tabIndex={-1}
        />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <AdminIcon name="upload" size={14} />
          {hasValue ? 'Replace' : 'Upload'}
        </button>
        {hasValue && (
          <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={() => onChange(null)}>
            <AdminIcon name="trash" size={14} />
            Remove
          </button>
        )}
        <p className="w-full text-xs text-[var(--text-muted)]">
          {kind === 'image' ? 'JPG, PNG, WEBP, GIF or SVG · max 8 MB' : 'PDF, DOC or DOCX · max 10 MB'} · stored on Cloudinary
        </p>
      </div>
    </div>
  );
}
