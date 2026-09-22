(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');
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
