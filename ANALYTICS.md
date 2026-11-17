# Marketing analytics

Scope: Vercel project wildtrkr-marketing (prj_FHNBrcMpEBV8tbls81Bs0uKMrZt5), repository brendanjwilliamson70-alt/wildtrkr-marketing. Production hosts: wildtrkr.com and www.wildtrkr.com. No operational platform, database, device integration or Manta changes.

## Dashboard

https://vercel.com/brendanjwilliamson70-8601s-projects/wildtrkr-marketing/analytics

Vercel Web Analytics records page views, anonymous visitors, pages and referrers. The shared analytics.js script loads on both index.html and devices.html. Collection must be enabled in Vercel and followed by a deployment. Google Analytics and LinkedIn Insight Tag are not installed.

## LinkedIn campaign links

Use a different campaign slug per post, for example:

https://wildtrkr.com/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=intro_post_01

Use only lowercase letters, numbers, underscores and hyphens in campaign values (maximum 64 characters). Never put a person's name, email address, customer identifier or other personal information in these parameters. Source and campaign are retained in this browser tab's sessionStorage across the two marketing pages; a newly tagged source replaces the previous attribution. An untagged LinkedIn referrer is recorded as linkedin; if the browser supplies no referrer or tag, it cannot be recovered reliably. This is session attribution, not cross-device or person-level attribution.

The marketing_visit custom event records source and campaign on each page load, allowing campaign breakdown on standard Pro. Every other custom event carries the same two properties. Native UTM dashboard panels may require Web Analytics Plus; this implementation does not purchase or require that upgrade. Page views and marketing_visit are separate measures; do not add them together as visits.

## Events

| Event | Meaning |
| --- | --- |
| marketing_visit | Marketing page loaded, with source and campaign |
| demo_enquiry_click, trial_enquiry_click, starter_pack_enquiry_click | Specific enquiry CTA selected |
| gateway_enquiry_click, rental_enquiry_click, manual_trapping_enquiry_click, field_operations_enquiry_click | Other specific enquiry CTA selected |
| purchase_quote_click, gateway_quote_click | Calculator quote CTA selected |
| contact_click, pricing_click, field_trial_click | General navigation to enquiry, pricing or trial section |
| email_click | Email link clicked; does not prove an email was sent |
| platform_login_click | Link to operational platform clicked; no tracking code is added to that platform |
| purchase_calculator_used, gateway_calculator_used | First calculator change per page view |
| overview_video_play | First video play per page view |
| enquiry_started | First focus in the enquiry form per page view |
| enquiry_submitted | Contact API returned a successful response; upstream SendGrid accepted the enquiry. This is not a guarantee of inbox delivery. |
| enquiry_failed | Contact request failed or timed out; no successful conversion is recorded |

CTA clicks are interest, not leads. Use enquiry_submitted as the lead conversion. Marketing enquiries remain in the existing email workflow; analytics has no contact details or connection to customer accounts.

## Privacy and resilience

No cookies or persistent visitor identifiers are added by this code. Only source and campaign are stored in sessionStorage; storage failures are tolerated. Arbitrary query parameters and URL fragments are removed before sending analytics. Form field values and error text are never passed to analytics. Source/campaign values use a restricted format. Vercel's own anonymized analytics processing still applies. The footer discloses analytics use. Global Privacy Control and Do Not Track disable this integration. Preview deployments and all other hosts are excluded. A blocked collector does not prevent calculator or enquiry use.

## Verification

Browser checks before deployment: LinkedIn attribution; URL redaction; enquiry CTA; successful contact response produces one conversion; rejected contact response does not convert and preserves entered text; no form details in events; attribution retained on devices page; duplicate bootstrap excluded; invalid campaign rejected; previews and privacy opt-out excluded; no browser errors. Contact API responses were mocked for these tests so no test enquiry email was sent.

After deployment, check /_vercel/insights/script.js returns JavaScript, open a tagged production URL, and inspect successful /_vercel/insights/view and /_vercel/insights/event requests. Confirm the tagged campaign appears in Analytics custom events. Verification traffic uses campaign analytics_verification_20261117; exclude that campaign when reviewing sales results. Reporting can lag behind collection. Data starts at deployment; historical visits cannot be reconstructed by this installation.
