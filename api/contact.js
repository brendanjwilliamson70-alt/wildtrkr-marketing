const allowed = new Set(['https://wildtrkr.com', 'https://www.wildtrkr.com']);
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const reply = (status, message) => res.status(status).json({ message });
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, 'Please use the enquiry form.'); }
  if (!allowed.has(req.headers.origin)) return reply(403, 'Please submit from wildtrkr.com.');
  if (!(req.headers['content-type'] || '').startsWith('application/json')) return reply(415, 'Please use the enquiry form.');
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { return reply(400, 'Please check your details.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Please check your details.');
  if (JSON.stringify(body).length > 16000) return reply(413, 'Please shorten your message.');
  if (body.website) return reply(400, 'Unable to submit this enquiry. Please email us directly.');
  const fields = {};
  for (const [key, max] of Object.entries({Name:120, Organisation:200, Email:254, Phone:60, Message:5000})) {
    if (typeof body[key] !== 'string' || body[key].length > max) return reply(400, 'Please check your details and message length.');
    fields[key] = body[key].trim();
  }
  if (!fields.Name || !fields.Organisation || !fields.Message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.Email)) return reply(400, 'Please enter your name, organisation, email and message.');
  if (/[\r\n]/.test(fields.Name + fields.Organisation + fields.Email + fields.Phone)) return reply(400, 'Please check your contact details.');
  if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_FROM_EMAIL) return reply(503, 'Enquiries are temporarily unavailable. Please email contact@wildtrkr.com.');
  const text = Object.entries(fields).map(([k,v]) => `${k}: ${v}`).join('\n\n');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', signal: AbortSignal.timeout(12000),
      headers: {Authorization:`Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type':'application/json'},
      body:JSON.stringify({personalizations:[{to:[{email:'contact@wildtrkr.com'}]}], from:{email:process.env.CONTACT_FROM_EMAIL.trim(), name:'WildTrkr'}, reply_to:{email:fields.Email, name:fields.Name}, subject:'WildTrkr website enquiry', content:[{type:'text/plain', value:text}]})
    });
    if (response.status !== 202) return reply(502, 'We could not confirm your enquiry was sent. Please try again or email contact@wildtrkr.com.');
    return reply(200, 'Thank you. Your enquiry has been submitted. We’ll be in touch.');
  } catch { return reply(502, 'We could not confirm your enquiry was sent. Please try again or email contact@wildtrkr.com.'); }
};
