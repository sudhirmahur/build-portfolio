import ResourceManager from '../components/ResourceManager';

const headingFields = [
  { name: 'kicker', label: 'Small label above the title', type: 'text', half: true, placeholder: 'About' },
  { name: 'title', label: 'Page heading', type: 'text', half: true },
  { name: 'description', label: 'Intro text', type: 'textarea', rows: 3 },
];

const menuFields = (isHome) => [
  { name: 'label', label: 'Menu label', type: 'text', required: true, half: true, help: 'Text shown in the header and footer.' },
  ...(isHome
    ? []
    : [{ name: 'visible', label: 'Visibility', type: 'toggle', half: true, toggleLabel: 'Page is live (hidden pages redirect to home)' }]),
  { name: 'showInNav', label: 'Header menu', type: 'toggle', half: true, toggleLabel: 'Show in header menu' },
  { name: 'showInFooter', label: 'Footer menu', type: 'toggle', half: true, toggleLabel: 'Show in footer links' },
];

const builtinFields = (item) => [
  ...menuFields(item.slug === 'home'),
  ...(item.slug === 'home' ? [] : headingFields),
];

const customFields = (item) => [
  { name: 'label', label: 'Menu label', type: 'text', required: true, half: true, help: 'Text shown in the header and footer.' },
  {
    name: 'slug',
    label: 'Page URL',
    type: 'text',
    half: true,
    required: Boolean(item),
    placeholder: 'my-new-page',
    help: item ? 'Letters, numbers and dashes only. The page opens at /your-url.' : 'Leave blank to create it from the menu label.',
  },
  { name: 'visible', label: 'Visibility', type: 'toggle', half: true, toggleLabel: 'Page is live' },
  { name: 'showInNav', label: 'Header menu', type: 'toggle', half: true, toggleLabel: 'Show in header menu' },
  { name: 'showInFooter', label: 'Footer menu', type: 'toggle', half: true, toggleLabel: 'Show in footer links' },
  { type: 'heading', label: 'Page content' },
  ...headingFields,
  { name: 'body', label: 'Body text', type: 'textarea', rows: 6, help: 'Optional. Separate paragraphs with a blank line.' },
  {
    name: 'layout',
    label: 'How should the items below be displayed?',
    type: 'select',
    options: [
      { value: 'cards', label: 'Cards (image, title, text, link)' },
      { value: 'gallery', label: 'Image gallery' },
      { value: 'list', label: 'Vertical list' },
      { value: 'text', label: 'Text only (ignore items)' },
    ],
  },
  {
    name: 'items',
    label: 'Items',
    type: 'array',
    itemName: 'item',
    addLabel: 'Add item',
    newItem: () => ({ title: '', subtitle: '', description: '', image: null, link: '', linkLabel: '', tags: [] }),
    itemLabel: (it) => it.title,
    fields: [
      { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text', half: true },
      { name: 'image', label: 'Image', type: 'image', folder: 'pages' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'link', label: 'Link URL', type: 'url', half: true, placeholder: 'https://…' },
      { name: 'linkLabel', label: 'Link text', type: 'text', half: true, placeholder: 'Read more' },
      { name: 'tags', label: 'Tags', type: 'tags' },
    ],
  },
];

export default function PagesAdmin() {
  return (
    <ResourceManager
      title="Pages & menu"
      description="Control the header/footer menu. Reorder or hide pages, edit their headings, or create brand-new pages (they appear in the menu automatically)."
      endpoint="/admin/pages"
      singular="page"
      modalWide
      getFields={(item) => (item && item.type === 'builtin' ? builtinFields(item) : customFields(item))}
      newItem={() => ({
        label: '', slug: '', visible: true, showInNav: true, showInFooter: true,
        kicker: '', title: '', description: '', body: '', layout: 'cards', items: [],
      })}
      canDelete={(page) => page.type === 'custom'}
      describe={(page) => ({
        title: page.label,
        subtitle: page.slug === 'home' ? '/' : `/${page.slug}`,
        badges: [
          { label: page.type === 'builtin' ? 'Built-in' : 'Custom', tone: page.type === 'builtin' ? 'muted' : 'accent' },
          ...(page.showInNav ? [] : [{ label: 'Not in menu' }]),
        ],
      })}
    />
  );
}
