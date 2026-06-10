# WildTrkr Public Marketing Site (V1)

Static, Vercel-ready marketing website for:
- https://wildtrkr.com
- https://www.wildtrkr.com

This site is intentionally separated from the authenticated platform at https://app.wildtrkr.com.

## Files

- `index.html` - Public homepage content and semantic section structure
- `styles.css` - Responsive styling
- `vercel.json` - Static hosting behavior

## Deploy to Vercel

1. Create a new Vercel project and import this folder: `wildtrkr-marketing`.
2. Framework preset: `Other`.
3. Build command: leave empty.
4. Output directory: leave empty.
5. Deploy.
6. In Vercel project settings, add domains:
   - `wildtrkr.com`
   - `www.wildtrkr.com`

## DNS records (wildtrkr.com + www only)

Set DNS at your domain provider:

- Type: `A`
- Name/Host: `@`
- Value: `76.76.21.21`
- TTL: default or 300

- Type: `CNAME`
- Name/Host: `www`
- Value: `cname.vercel-dns.com`
- TTL: default or 300

Do not change DNS or routing for `app.wildtrkr.com`.

## Notes

- Login links point to `https://app.wildtrkr.com`.
- Contact form is V1 mailto-based and can be replaced later with an API endpoint.
- No Supabase/database/webhook/platform workflow dependencies are included in this project.
