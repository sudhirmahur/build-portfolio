import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { optimizeImage } from '../../utils/image';
import DynamicForm, { validateRequired } from '../fields/DynamicForm';
import AdminIcon from './AdminIcon';
import { Badge, Card, ConfirmDialog, Modal, PageHeader, Spinner } from './ui';

/**
 * Generic list + create/edit modal + delete + reorder + show/hide for any collection.
 *
 * props:
 *  title, description, endpoint ("/admin/projects")
 *  fields | getFields(item)         field definitions for the form (item is null when creating)
 *  newItem()                        default values when creating
 *  describe(item) -> { title, subtitle, image, badges: [{label, tone}] }
 *  canDelete(item)                  default true
 *  singular                         "project" (used in labels)
 *  toggleKey                        boolean key used by the eye button (default "visible")
 *  modalWide                        wider modal
 */
export default function ResourceManager({
  title,
  description,
  endpoint,
  fields,
  getFields,
  newItem = () => ({}),
  describe,
  canDelete = () => true,
  singular = 'item',
  toggleKey = 'visible',
  modalWide = false,
  headerExtra,
}) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // { item|null, values, formKey }
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(endpoint);
      setItems(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const formFields = editing ? (getFields ? getFields(editing.item) : fields) : [];

  const openCreate = () =>
    setEditing({ item: null, values: newItem(), formKey: `new-${Date.now()}` });
  const openEdit = (item) =>
    setEditing({ item, values: JSON.parse(JSON.stringify(item)), formKey: item._id });
  const closeForm = () => (saving ? undefined : setEditing(null));

  const setValue = (name, value) =>
    setEditing((current) => ({ ...current, values: { ...current.values, [name]: value } }));

  const handleSave = async (event) => {
    event?.preventDefault();
    const problem = validateRequired(formFields, editing.values);
    if (problem) {
      toast.error(problem);
      return;
    }
    // only send the fields defined in the form
    const payload = {};
    formFields.forEach((field) => {
      if (field.type !== 'heading') payload[field.name] = editing.values[field.name];
    });

    setSaving(true);
    try {
      if (editing.item) {
        const res = await api.put(`${endpoint}/${editing.item._id}`, payload);
        setItems((list) => list.map((it) => (it._id === res.data._id ? res.data : it)));
        toast.success(`${capitalise(singular)} updated`);
      } else {
        const res = await api.post(endpoint, payload);
        setItems((list) => [...list, res.data]);
        toast.success(`${capitalise(singular)} created`);
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setBusyDelete(true);
    try {
      await api.del(`${endpoint}/${deleting._id}`);
      setItems((list) => list.filter((it) => it._id !== deleting._id));
      toast.success(`${capitalise(singular)} deleted`);
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyDelete(false);
    }
  };

  const handleMove = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next); // optimistic
    try {
      const res = await api.put(`${endpoint}/reorder`, { ids: next.map((it) => it._id) });
      setItems(res.data);
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  const handleToggle = async (item) => {
    try {
      const res = await api.put(`${endpoint}/${item._id}`, { [toggleKey]: !item[toggleKey] });
      setItems((list) => list.map((it) => (it._id === res.data._id ? res.data : it)));
      toast.success(res.data[toggleKey] ? 'Now visible on the site' : 'Hidden from the site');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {headerExtra}
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <AdminIcon name="plus" size={16} />
              Add {singular}
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button type="button" className="btn btn-outline mt-4" onClick={load}>
            Try again
          </button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">No {singular}s yet. Click “Add {singular}” to create the first one.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => {
            const info = describe(item);
            const hidden = item[toggleKey] === false;
            return (
              <li key={item._id}>
                <Card className={`flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4 ${hidden ? 'opacity-70' : ''}`}>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {info.image !== undefined && (
                      <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elevated-2)] text-[var(--text-muted)]">
                        {info.image ? (
                          <img src={optimizeImage(info.image, 200)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <AdminIcon name="image" size={18} />
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{info.title || 'Untitled'}</p>
                      {info.subtitle && <p className="truncate text-sm text-[var(--text-muted)]">{info.subtitle}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {hidden && <Badge tone="red">Hidden</Badge>}
                        {(info.badges || []).map((badge, i) => (
                          <Badge key={`${badge.label}-${i}`} tone={badge.tone}>
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <button type="button" className="btn btn-outline btn-icon" onClick={() => handleMove(index, -1)} disabled={index === 0} aria-label="Move up" title="Move up">
                      <AdminIcon name="up" size={15} />
                    </button>
                    <button type="button" className="btn btn-outline btn-icon" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} aria-label="Move down" title="Move down">
                      <AdminIcon name="down" size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-icon"
                      onClick={() => handleToggle(item)}
                      aria-label={hidden ? 'Show on site' : 'Hide from site'}
                      title={hidden ? 'Show on site' : 'Hide from site'}
                    >
                      <AdminIcon name={hidden ? 'eye-off' : 'eye'} size={15} />
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>
                      <AdminIcon name="edit" size={14} />
                      Edit
                    </button>
                    {canDelete(item) && (
                      <button type="button" className="btn btn-danger btn-icon" onClick={() => setDeleting(item)} aria-label="Delete" title="Delete">
                        <AdminIcon name="trash" size={15} />
                      </button>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <Modal
          title={editing.item ? `Edit ${singular}` : `New ${singular}`}
          onClose={closeForm}
          wide={modalWide}
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="resource-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing.item ? 'Save changes' : `Create ${singular}`}
              </button>
            </>
          }
        >
          <form id="resource-form" onSubmit={handleSave} noValidate>
            <DynamicForm
              key={editing.formKey}
              fields={formFields}
              values={editing.values}
              onChange={setValue}
              idPrefix="rm"
            />
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${singular}?`}
          message={`“${describe(deleting).title || 'This item'}” will be permanently deleted${
            JSON.stringify(deleting).includes('publicId') ? ', including its uploaded files' : ''
          }. This cannot be undone.`}
          busy={busyDelete}
          onConfirm={handleDelete}
          onCancel={() => (busyDelete ? undefined : setDeleting(null))}
        />
      )}
    </div>
  );
}

function capitalise(text = '') {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
