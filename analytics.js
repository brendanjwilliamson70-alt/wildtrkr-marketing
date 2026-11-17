(() => {
  'use strict';
  // Production marketing domains only. No operational-platform or preview traffic.
  if (!['wildtrkr.com', 'www.wildtrkr.com'].includes(location.hostname)) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  if (window.wildtrkrAnalyticsLoaded) return;
  window.wildtrkrAnalyticsLoaded = true;

  const clean = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) ? value.toLowerCase() : '';
  const params = new URLSearchParams(location.search);
  const source = clean(params.get('utm_source'));
  const campaign = clean(params.get('utm_campaign'));
  const storageKey = 'wildtrkr:marketing-attribution:v1';
  let attribution = { source: 'direct', campaign: 'none' };
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && clean(saved.source) && clean(saved.campaign)) attribution = { source: saved.source, campaign: saved.campaign };
  } catch { /* Storage can be blocked; tracking still works for this page. */ }
  if (source) {
    attribution = { source, campaign: campaign || 'none' };
  } else if (attribution.source === 'direct' && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(host)) attribution.source = 'linkedin';
      else if (/(^|\.)google\.[a-z.]+$/.test(host)) attribution.source = 'google';
      else if (!['wildtrkr.com', 'www.wildtrkr.com'].includes(host)) attribution.source = 'referral';
    } catch { /* Invalid referrer. */ }
  }
  try { sessionStorage.setItem(storageKey, JSON.stringify(attribution)); } catch { /* Optional storage. */ }

  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  // Send only named campaign parameters. Never send fragments, form values or arbitrary URL parameters.
  window.va('beforeSend', event => {
    const url = new URL(event.url);
    const safe = new URLSearchParams();
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const value = clean(url.searchParams.get(key));
      if (value) safe.set(key, value);
    }
    url.search = safe.toString();
    url.hash = '';
    return { ...event, url: url.href };
  });
  const track = name => {
    try { window.va('event', { name, data: { ...attribution } }); } catch { /* Analytics never blocks enquiries. */ }
  };
  // Also makes campaign attribution available on standard Pro, without a Plus upgrade.
  track('marketing_visit');

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const enquiry = {
      demo: 'demo_enquiry_click', trial: 'trial_enquiry_click', starter: 'starter_pack_enquiry_click',
      gateway: 'gateway_enquiry_click', rental: 'rental_enquiry_click',
      'manual-trapping': 'manual_trapping_enquiry_click', 'site-visits': 'field_operations_enquiry_click'
    }[link.dataset.enquiry];
    if (enquiry) return track(enquiry);
    if (link.hasAttribute('data-gateway-quote')) return track('gateway_quote_click');
    if (link.dataset.quote === 'purchase') return track('purchase_quote_click');
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return track('email_click');
    const url = new URL(href, location.href);
    if (url.hostname === 'app.wildtrkr.com') return track('platform_login_click');
    if (url.origin !== location.origin) return;
    if (url.hash === '#contact') track('contact_click');
    else if (['#calculator', '#gateway-estimate-title'].includes(url.hash)) track('pricing_click');
    else if (url.hash === '#field-trial') track('field_trial_click');
  });

  const seen = new Set();
  const once = name => { if (!seen.has(name)) { seen.add(name); track(name); } };
  document.addEventListener('focusin', event => {
    if (event.target.closest('.contact-form')) once('enquiry_started');
  });
  document.addEventListener('change', event => {
    if (event.target.closest('.purchase-calculator')) once('purchase_calculator_used');
    if (event.target.closest('.gateway-calculator')) once('gateway_calculator_used');
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-purchase-step]')) once('purchase_calculator_used');
  });
  document.addEventListener('play', event => {
    if (event.target.tagName === 'VIDEO') once('overview_video_play');
  }, true);
  document.addEventListener('wildtrkr:enquiry-sent', () => track('enquiry_submitted'));
  document.addEventListener('wildtrkr:enquiry-failed', () => track('enquiry_failed'));

  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
