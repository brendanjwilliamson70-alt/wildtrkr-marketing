(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');
  const message = form.querySelector('[name="Message"]');
  let generatedSummary = '';
  const setEnquiry = summary => {
    // Replace only our untouched summary; keep anything the visitor edited.
    const previous = generatedSummary && message.value.startsWith(generatedSummary + '\n\n')
      ? message.value.slice(generatedSummary.length + 2) : message.value;
    message.value = summary + '\n\n' + previous;
    generatedSummary = summary;
  };
  const enquirySummaries = {
    starter: 'Gateway Starter Pack enquiry: $600 + GST first-order hardware offer, plus gateway monitoring.',
    gateway: 'Gateway system enquiry.',
    rental: 'Rental enquiry: I am running a short-term trapping program and would like to discuss rental plans.',
    'manual-trapping': 'Manual trapping enquiry: I would like a software-only demonstration and pricing for managing our existing traps.',
    'site-visits': 'Field operations enquiry: I would like to see field-day records, site-visit times and management reporting, and confirm availability.',
    trial: 'Cellular field trial enquiry: five devices for 90 days at $600 + GST. Please confirm hardware ownership, return and post-trial subscription terms.',
    'demo-access': '14-day demo access enquiry: I would like an individual read-only login to explore the Granite Plains demonstration account.',
    demo: 'Demo enquiry: I would like to discuss my field program and see WildTrkr.'
  };
  document.querySelectorAll('[data-enquiry]').forEach(link => {
    link.addEventListener('click', () => setEnquiry(enquirySummaries[link.dataset.enquiry] || enquirySummaries.demo));
  });
  document.addEventListener('wildtrkr:enquiry', event => setEnquiry(event.detail));
  form.addEventListener('reset', () => { generatedSummary = ''; });
  button.disabled = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    try {
      const response = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(form))), signal:AbortSignal.timeout(18000)});
      const data = await response.json().catch(() => { throw new Error('We could not confirm your enquiry was sent. Please try again or email contact@wildtrkr.com.'); });
      if (!response.ok) throw new Error(data.message || 'Unable to send. Please email contact@wildtrkr.com.');
      status.textContent = data.message;
      form.reset();
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' || error instanceof TypeError
        ? 'We could not confirm your enquiry was sent. Please try again or email contact@wildtrkr.com.' : error.message;
    } finally {
      button.disabled = false;
      button.textContent = 'Send enquiry';
    }
  });
})();
