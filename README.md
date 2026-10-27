# SRN Tech — Frontend (React + Vite + Tailwind)

| URL | Page |
|---|---|
| `/` | SRN Tech Private Limited company page (static content) |
| `/p/<naam>` | Kisi user ka public portfolio — sirf us user ka data |
| `/admin/register`, `/admin/login` | Register / login |
| `/admin` | Admin panel (har user sirf apna data) |
| `/admin/users` | Sirf super admin: saare users, details, portfolio URLs |

Saare links relative hain (`/p/...`) aur portfolio URL `window.location.origin` se banta hai, isliye deploy ke baad apne aap aapke domain ka hota hai (localhost nahi).

## Local
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5173  (pehle backend chalao)
npm run build
```

## Deploy (Vercel / Netlify)
1. Backend pehle deploy karo (Render/Railway) aur uska URL lo.
2. Frontend project me Environment Variable set karo: `VITE_API_URL=https://<backend-url>/api`
3. Deploy karo. `vercel.json` / `public/_redirects` SPA routing handle karte hain (`/p/naam` refresh par bhi chalega).
4. Backend `.env` me `CLIENT_URL=https://<frontend-domain>` rakho (CORS).

## Content kahan badalna hai
- Company page (`/`): `src/pages/Landing.jsx` (upar `COMPANY`, `STATS`, `SERVICES`, `TECH` constants)
- Page title / SEO: `index.html`
- Portfolio ka content: admin panel se (Profile & content, Pages & menu, Design & link)

## New in this version

- **Admin → Resume builder**: **20 A4 resume templates, each with a different page layout (live preview, "Import from portfolio", Save, **Download PDF** — in the print window choose *Save as PDF*, paper A4, margins None, Background graphics ON).
- **Admin → Templates**: **10** portfolio templates — Classic (default), Brooklyn, Amber Profile, Blue Sidebar, Black & Gold, Midnight Green, Neon Developer, Profile Card, Cyan Studio, Crimson Dark. Each has its own colours/fonts. Add `?tpl=<id>` to a portfolio URL to preview. Colours picked on the *Design* page override the template colours.
- No new npm dependencies, so `package-lock.json` is unchanged.
- Works with the old backend too (template falls back to Classic); saving a resume/template needs the new backend.
