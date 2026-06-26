# Lethbridge Solar — Website Package
### Ready-to-host website files

---

## Files in this package

```
lethbridge-solar/
├── index.html          ← Main website
├── thank-you.html      ← Post-form-submission page
├── robots.txt          ← SEO crawler instructions
├── sitemap.xml         ← SEO sitemap (submit to Google)
├── .htaccess           ← Apache server config (HTTPS, caching, security)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All interactivity + tracking
└── images/
    └── favicon.svg     ← Browser tab icon
```

---

## Before you go live — checklist

### 1. Google Analytics 4 (5 minutes)
1. Go to analytics.google.com → Create account → Create property
2. Choose "Web" → Enter your domain
3. Copy your Measurement ID (looks like: G-XXXXXXXXXX)
4. In `index.html`: replace **both** instances of `GA_MEASUREMENT_ID` with your ID
5. In `thank-you.html`: replace `GA_MEASUREMENT_ID` with your ID

### 2. Formspree — quote form (5 minutes, free)
1. Go to formspree.io → Sign up (free tier: 50 submissions/month)
2. Click "New Form" → name it "Lethbridge Solar Quote Requests"
3. Copy your Form ID (looks like: xrgvkpqw)
4. In `index.html`: replace `YOUR_FORM_ID` in the form action URL
5. In `index.html`: update the `_next` redirect URL to your actual domain
6. Test by submitting the form — check your Formspree dashboard

### 3. Replace placeholder content
Find and replace these in `index.html`:
- `(403) 123-4567`  → your real phone number
- `hello@lethbridgesolar.ca` → your real email address
- `lethbridgesolar.ca` → your actual domain (if different)
- `7` in founding spots → update as spots fill

### 4. Update meta tags & sitemap
- In `index.html` → update `og:url` and `canonical` to your real domain
- In `sitemap.xml` → update the `<loc>` URL and `<lastmod>` date

---

## Hosting options (easiest → most control)

### Option A — Netlify (RECOMMENDED — free, fastest)
1. Go to netlify.com → Sign up free
2. Drag the entire `lethbridge-solar/` folder onto the deploy area
3. Your site is live in 60 seconds at a random URL
4. Go to "Domain settings" → add your custom domain
5. SSL certificate is automatic (free)
6. Note: `.htaccess` is Apache-specific — Netlify ignores it (handles redirects natively)

### Option B — Vercel (free, developer-friendly)
1. Go to vercel.com → Sign up
2. Install Vercel CLI or connect GitHub
3. Run `vercel` in the `lethbridge-solar/` folder
4. Add custom domain in dashboard

### Option C — GoDaddy / SiteGround / cPanel hosting
1. Log into your hosting control panel → File Manager
2. Navigate to `public_html/` folder
3. Upload all files from `lethbridge-solar/` (including hidden `.htaccess`)
4. Make sure `.htaccess` is visible (enable "show hidden files" in File Manager)
5. Your site is live at your domain

### Option D — GitHub Pages (free, no backend)
1. Create a GitHub account → New repository named `lethbridgesolar.ca`
2. Upload all files
3. Go to Settings → Pages → Source: main branch → / (root)
4. Note: `.htaccess` doesn't work on GitHub Pages — use Netlify for redirects

---

## Domain setup

1. Buy `lethbridgesolar.ca` at ca.godaddy.com or namecheap.com (~$15/yr)
2. In your domain registrar, point DNS to your hosting:
   - **Netlify**: Add CNAME record `www → your-netlify-site.netlify.app`
   - **Vercel**: Follow their DNS instructions
   - **cPanel hosting**: Set nameservers to your host's nameservers

---

## After launch — submit to Google

1. Go to search.google.com/search-console
2. Add your property → verify domain ownership
3. Submit your sitemap: `https://lethbridgesolar.ca/sitemap.xml`
4. Google will index your site within 1–2 weeks

---

## Tracking events in GA4

All these events fire automatically — view them in:
GA4 → Reports → Engagement → Events

| Event name           | When it fires                          |
|----------------------|----------------------------------------|
| `page_view`          | Every page load                        |
| `cta_click`          | Any CTA button clicked                 |
| `nav_click`          | Nav link clicked                       |
| `phone_click`        | Phone number link clicked              |
| `email_click`        | Email link clicked                     |
| `calculator_interact`| Calculator slider/select changed       |
| `calculator_engaged` | User made 3+ calculator interactions   |
| `quote_form_submit`  | Quote form submitted                   |
| `generate_lead`      | Quote form submitted (conversion)      |
| `section_view`       | Section scrolled into view             |
| `scroll_depth`       | 25/50/75/90% of page scrolled          |
| `time_on_page`       | 30s / 60s / 2min / 5min on page        |
| `cta_impression`     | CTA button scrolled into view          |
| `exit_intent`        | Cursor moved toward browser chrome     |
| `mobile_menu_toggle` | Hamburger menu opened/closed           |
| `service_cta_click`  | Service-specific CTA clicked           |
| `footer_nav`         | Footer link clicked                    |
| `social_click`       | Social media link clicked              |

### Mark `generate_lead` as a conversion:
GA4 → Configure → Events → find `generate_lead` → toggle "Mark as conversion"

---

## Ongoing maintenance

- **Rebates section**: Update the "Current incentives" text monthly — outdated info kills trust
- **Founding spots**: Decrease the `7` number in `index.html` as spots fill
- **Case studies**: Add real installs to the services section as you complete jobs
- **Google reviews**: Ask every customer → they appear in your Google Business Profile
- **Sitemap**: Update `<lastmod>` date in `sitemap.xml` when you make changes

---

## Need help?

All files are plain HTML/CSS/JS — no framework, no build step, no Node.js.
Any web developer can pick this up and extend it immediately.

Questions about the website → ask Claude (claude.ai)
Questions about hosting → contact your host's support
Questions about GA4 → support.google.com/analytics
