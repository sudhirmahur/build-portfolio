import { useId, useState } from 'react';
import AdminIcon from '../components/AdminIcon';
import { Toggle } from '../components/ui';
import ImageUploader from './ImageUploader';
import { ICONS, ICON_OPTIONS } from '../../utils/icons';

/* -------- stable keys for array items (so inputs keep focus while typing) -------- */
const keyMap = new WeakMap();
let seq = 0;
const keyOf = (obj) => {
  if (!keyMap.has(obj)) {
    seq += 1;
    keyMap.set(obj, `item-${seq}`);
  }
  return keyMap.get(obj);
};
const derive = (obj, patch) => {
  const next = { ...obj, ...patch };
  keyMap.set(next, keyOf(obj));
  return next;
};

/* -------- text <-> list conversion for tags / lines / paragraphs -------- */
const SEPARATORS = {
  tags: { join: ', ', split: /,/ },
  lines: { join: '\n', split: /\r?\n/ },
  paragraphs: { join: '\n\n', split: /\r?\n\s*\r?\n/ },
};

function ListInput({ id, mode, value, onChange, placeholder, rows = 4 }) {
  const { join, split } = SEPARATORS[mode];
  const [text, setText] = useState(() => (Array.isArray(value) ? value.join(join) : ''));

  const handle = (e) => {
    const next = e.target.value;
    setText(next);
    onChange(
      next
        .split(split)
        .map((part) => part.trim())
        .filter(Boolean)
    );
  };

  if (mode === 'tags') {
    return (
      <input id={id} type="text" className="field-input" value={text} onChange={handle} placeholder={placeholder} />
    );
  }
  return (
    <textarea id={id} className="field-input" rows={rows} value={text} onChange={handle} placeholder={placeholder} />
  );
}

function IconPicker({ id, value, onChange }) {
  const Preview = ICONS[value];
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated-2)] text-[var(--accent)]">
        {Preview ? <Preview size={18} /> : <AdminIcon name="code" size={18} />}
      </span>
      <select id={id} className="field-input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        {!ICONS[value] && <option value={value || ''}>{value || 'Select an icon'}</option>}
        {ICON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ArrayField({ field, value, onChange, id }) {
  const items = Array.isArray(value) ? value : [];
  const noun = field.itemName || 'item';

  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? derive(item, patch) : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...items, field.newItem ? field.newItem() : {}]);

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="rounded-md border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--text-muted)]">
          No {noun}s yet.
        </p>
      )}
      {items.map((item, index) => (
        <div key={keyOf(item)} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2">
            <p className="min-w-0 truncate text-sm font-medium">
              {field.itemLabel?.(item, index) || `${noun[0].toUpperCase()}${noun.slice(1)} ${index + 1}`}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" className="btn btn-outline btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                <AdminIcon name="up" size={14} />
              </button>
              <button type="button" className="btn btn-outline btn-icon" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down">
                <AdminIcon name="down" size={14} />
              </button>
              <button type="button" className="btn btn-danger btn-icon" onClick={() => remove(index)} aria-label={`Remove ${noun}`}>
                <AdminIcon name="trash" size={14} />
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <DynamicForm
              fields={field.fields}
              values={item}
              onChange={(name, val) => update(index, { [name]: val })}
              idPrefix={`${id}-${keyOf(item)}`}
            />
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline btn-sm" onClick={add}>
          <AdminIcon name="plus" size={14} />
          {field.addLabel || `Add ${noun}`}
        </button>
      </div>
    </div>
  );
}

function FieldControl({ field, value, onChange, id }) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          id={id}
          className="field-input"
          rows={field.rows || 4}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'number':
      return (
        <input
          id={id}
          type="number"
          className="field-input"
          min={field.min}
          max={field.max}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      );
    case 'range':
      return (
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[var(--accent)]"
          />
          <span className="w-12 shrink-0 text-right text-sm tabular-nums text-[var(--text-muted)]">{value ?? 0}%</span>
        </div>
      );
    case 'select':
      return (
        <select id={id} className="field-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((option) => {
            const opt = typeof option === 'string' ? { value: option, label: option } : option;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      );
    case 'toggle':
      return <Toggle id={id} checked={value} onChange={onChange} label={field.toggleLabel} />;
    case 'tags':
    case 'lines':
    case 'paragraphs':
      return (
        <ListInput
          id={id}
          mode={field.type}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          rows={field.rows}
        />
      );
    case 'image':
      return <ImageUploader id={id} value={value} onChange={onChange} kind="image" folder={field.folder} />;
    case 'file':
      return <ImageUploader id={id} value={value} onChange={onChange} kind="file" folder={field.folder} />;
    case 'icon':
      return <IconPicker id={id} value={value} onChange={onChange} />;
    case 'array':
      return <ArrayField field={field} value={value} onChange={onChange} id={id} />;
    default:
      return (
        <input
          id={id}
          type={['url', 'email', 'tel', 'password'].includes(field.type) ? field.type : 'text'}
          className="field-input"
          value={value ?? ''}
          placeholder={field.placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

const HELP_DEFAULTS = {
  tags: 'Separate with commas.',
  lines: 'One per line.',
  paragraphs: 'Separate paragraphs with a blank line.',
};

/**
 * Renders a list of field definitions.
 * field = { name, label, type, required, placeholder, help, half, options, fields, newItem, itemName, itemLabel, ... }
 */
export default function DynamicForm({ fields, values, onChange, idPrefix }) {
  const generated = useId();
  const prefix = idPrefix || generated;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      {fields.map((field, index) => {
        if (field.type === 'heading') {
          return (
            <div key={`heading-${index}`} className="border-b border-[var(--border)] pb-2 pt-3 sm:col-span-2">
              <h3 className="font-display text-base font-medium text-[var(--accent)]">{field.label}</h3>
              {field.help && <p className="mt-1 text-xs text-[var(--text-muted)]">{field.help}</p>}
            </div>
          );
        }
        const id = `${prefix}-${field.name}`;
        const help = field.help || HELP_DEFAULTS[field.type];
        return (
          <div key={field.name} className={field.half ? '' : 'sm:col-span-2'}>
            {field.type !== 'toggle' && (
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                {field.label}
                {field.required && <span className="ml-0.5 text-red-400">*</span>}
              </label>
            )}
            {field.type === 'toggle' && field.label && (
              <p className="mb-1.5 text-sm font-medium">{field.label}</p>
            )}
            <FieldControl
              field={field}
              value={values?.[field.name]}
              onChange={(val) => onChange(field.name, val)}
              id={id}
            />
            {help && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{help}</p>}
          </div>
        );
      })}
    </div>
  );
}

/** Returns the first missing-required message for top-level fields, or null. */
export function validateRequired(fields, values) {
  for (const field of fields) {
    if (!field.required) continue;
    const value = values?.[field.name];
    const empty = value === undefined || value === null || (typeof value === 'string' && !value.trim());
    if (empty) return `${field.label} is required`;
  }
  return null;
}
