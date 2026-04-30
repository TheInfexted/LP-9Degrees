# Deploying NINE° to CloudPanel

The site is a static Astro build, so it doesn't need a Node.js runtime on the server. CloudPanel's "Static HTML" site type serves it as plain files behind nginx, with Let's Encrypt SSL.

---

## 1. Build locally

From the project root:

```bash
npm install      # only the first time
npm run build
```

This produces a `dist/` folder (~700 KB) with `index.html`, `_astro/index.*.css`, and `img/` (logo + venue photos).

Optional sanity check:

```bash
npm run preview
```

That serves the built `dist/` on `http://localhost:4321/`. If anything looks broken there, fix it before deploying — `dist/` is what's going to the server.

---

## 2. Create the site in CloudPanel

1. Log in to your CloudPanel admin (`https://your-server-ip:8443`).
2. Click **+ Add Site → Create a Static HTML Site**.
3. Fill in:
   - **Domain Name:** `ninedegrees.my`
   - **Site User:** create a new one, e.g. `ninedegrees` (CloudPanel will generate a password)
   - **Site User Password:** copy and store it — you'll need it for SFTP / SSH
4. Click **Create Site**.

CloudPanel will create:
- A site root at `/home/ninedegrees/htdocs/ninedegrees.my/`
- An nginx vhost listening on the domain
- An SFTP/SSH user named `ninedegrees`

---

## 3. Point your domain at the server

In your DNS provider (where `ninedegrees.my` is registered):

| Type | Host | Value |
|------|------|-------|
| `A` | `@` | your CloudPanel server's public IPv4 |
| `A` | `www` | your CloudPanel server's public IPv4 |

Wait for DNS to propagate (usually 5–30 minutes). You can check with:

```bash
dig ninedegrees.my +short
```

It should return your server IP.

---

## 4. Upload `dist/` to the server

Pick whichever you're comfortable with.

### Option A — SFTP (FileZilla / Cyberduck / Transmit)

1. Connect to your server with the SFTP user CloudPanel created (`ninedegrees`, port 22).
2. Navigate to `/home/ninedegrees/htdocs/ninedegrees.my/`.
3. Delete the placeholder `index.html` CloudPanel created.
4. Upload **the contents of** `dist/` (so `index.html` lands directly inside `ninedegrees.my/`, not nested under a `dist` folder).
5. Done.

### Option B — One-shot rsync over SSH (faster, scriptable)

From the project root, after `npm run build`:

```bash
rsync -avz --delete \
  dist/ \
  ninedegrees@YOUR_SERVER_IP:/home/ninedegrees/htdocs/ninedegrees.my/
```

`--delete` removes anything on the server that's no longer in `dist/`. Drop that flag if you ever upload non-build files manually.

You can save this as `scripts/deploy.sh` and run `bash scripts/deploy.sh` for one-line redeploys.

---

## 5. Issue the SSL certificate

Back in CloudPanel:

1. Open the site you just created.
2. Click the **SSL/TLS** tab.
3. Click **Actions → New Let's Encrypt Certificate**.
4. Tick `ninedegrees.my` and `www.ninedegrees.my`.
5. Click **Create and Install**.

CloudPanel auto-renews the cert every 60 days.

---

## 6. Add the security & cache headers

In CloudPanel, open the site → **Vhost** tab. Find the `location /` block and add these inside it (above any existing `try_files` line):

```nginx
# Cache hashed Astro assets aggressively, the rest lightly
location ~* \.(css|js|woff2?|png|jpe?g|webp|avif|svg)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
}

# Security headers
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "interest-cohort=()" always;
```

Save → CloudPanel reloads nginx.

---

## 7. Verify

Open `https://ninedegrees.my` in a browser. You should see:

- Hero with "We pack the rooms that run KL." in white + cyan
- 404 + Nono venue tiles with the real photos
- Recent Nights set list
- Cyan Strobe section with **WhatsApp Us** + **@ninedegrees_kl** buttons
- Footer with WhatsApp / Instagram / Email columns
- Padlock icon (HTTPS active)

Mobile spot-check: open the site on your phone over cellular (not Wi-Fi). The WhatsApp button should open the WhatsApp app directly with your number prefilled.

---

## Updating the site later

Anytime you change content, photos, or the recent-nights list:

```bash
npm run build
rsync -avz --delete dist/ ninedegrees@YOUR_SERVER_IP:/home/ninedegrees/htdocs/ninedegrees.my/
```

That's the whole deploy loop.

### Common content edits

| What changed | File to edit |
|---|---|
| Recent nights | `src/components/RecentNights.astro` (the `nights` array at the top) |
| Phone / IG / email | `src/components/Hero.astro`, `src/components/Strobe.astro`, `src/components/SiteFooter.astro` |
| Hero headline / sub copy | `src/components/Hero.astro` |
| Venue photos | drop new files in `public/img/` (overwrite `404.jpg` / `nono.jpg`) |
| Venue descriptors | `src/components/Venues.astro` (the `venues` array) |
| Brand logo (full version) | drop the high-fidelity export at `public/img/logo-full.png` — the Wordmark component will detect it automatically and use it instead of the cyan-only mark |

---

## Troubleshooting

**The site loads but with no styles.** Your nginx vhost is probably missing MIME types. CloudPanel's static-site default has them, but if you've heavily edited the vhost, restore from CloudPanel's reset option.

**Photos load but logo doesn't.** Confirm `public/img/logo-trim.png` and `logo.png` were both copied. Check `/home/ninedegrees/htdocs/ninedegrees.my/img/` listing on the server.

**WhatsApp button opens a desktop chat instead of the phone app.** That's expected on desktop browsers — `wa.me/<number>` does The Right Thing on mobile.

**404 on direct deep links** (e.g. `ninedegrees.my/contact`). The site is single-page, so `/contact` is `#contact` (a fragment). Direct deep links to `/contact` would 404 — that's fine, no one navigates there directly; it's only used by the in-page nav.

**Need to roll back?** Keep the previous `dist/` folder before each deploy (rename to `dist-2026-04-30` etc.). To restore, rsync that older folder over.
