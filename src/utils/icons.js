import {
  Braces, FileCode2, Terminal, Atom, Wind, Layers, MousePointerClick, Server, Boxes,
  Layout, Globe, Database, GitBranch, AppWindow, SendHorizonal, CreditCard, KeyRound,
  Mail, ShieldCheck, Eye, Phone, FileText, MapPin, Briefcase, CalendarClock,
  GraduationCap, Award,
} from 'lucide-react';
import GithubIcon from '../components/icons/GithubIcon';
import LinkedinIcon from '../components/icons/LinkedinIcon';
import {
  CodeIcon, CpuIcon, CloudIcon, StarIcon, ZapIcon, HeartIcon, UsersIcon, LockIcon,
  SmartphoneIcon, MonitorIcon, LinkIcon, WrenchIcon,
} from '../components/icons/CustomIcons';

// name (stored in MongoDB) -> component. Add a new entry here to make it
// selectable in the admin panel icon picker.
export const ICONS = {
  code: CodeIcon,
  braces: Braces,
  'file-code': FileCode2,
  terminal: Terminal,
  atom: Atom,
  wind: Wind,
  layers: Layers,
  pointer: MousePointerClick,
  server: Server,
  boxes: Boxes,
  layout: Layout,
  globe: Globe,
  database: Database,
  'git-branch': GitBranch,
  'app-window': AppWindow,
  send: SendHorizonal,
  'credit-card': CreditCard,
  key: KeyRound,
  mail: Mail,
  'shield-check': ShieldCheck,
  eye: Eye,
  phone: Phone,
  'file-text': FileText,
  'map-pin': MapPin,
  briefcase: Briefcase,
  'calendar-clock': CalendarClock,
  'graduation-cap': GraduationCap,
  award: Award,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  cpu: CpuIcon,
  cloud: CloudIcon,
  star: StarIcon,
  zap: ZapIcon,
  heart: HeartIcon,
  users: UsersIcon,
  lock: LockIcon,
  smartphone: SmartphoneIcon,
  monitor: MonitorIcon,
  link: LinkIcon,
  wrench: WrenchIcon,
};

export const ICON_OPTIONS = Object.keys(ICONS).map((name) => ({ value: name, label: name }));

export const getIcon = (name, fallback = 'code') => ICONS[name] || ICONS[fallback];
