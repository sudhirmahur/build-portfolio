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
