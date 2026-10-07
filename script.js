const nav = document.getElementById('site-nav');
const toggle = document.querySelector('.menu-toggle');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
});

// Pre-select service when a service link is used
document.querySelectorAll('[data-service]').forEach(link =>
  link.addEventListener('click', () => { document.getElementById('service').value = link.dataset.service; }));

const form = document.getElementById('booking');
const today = new Date().toISOString().split('T')[0];
form.date.min = today;

const rules = {
  name: v => v.trim().length >= 2 || 'Enter your full name.',
  phone: v => /^\+?[\d\s-]{10,15}$/.test(v.trim()) || 'Enter a valid phone number, for example +91 98765 12345.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  service: v => v !== '' || 'Choose a service.',
  date: v => (v !== '' && v >= today) || 'Choose today or a future date.',
  time: v => v !== '' || 'Choose a preferred time.',
  message: v => v.trim().length >= 10 || 'Tell us a little more (at least 10 characters).'
};

function validateField(name) {
  const field = form.elements[name];
  const result = rules[name](field.value);
  const error = document.getElementById(name + '-error');
  const valid = result === true;
  error.textContent = valid ? '' : result;
  field.setAttribute('aria-invalid', String(!valid));
  field.setAttribute('aria-describedby', name + '-error');
  return valid;
}

Object.keys(rules).forEach(name => form.elements[name].addEventListener('blur', () => validateField(name)));

form.addEventListener('submit', e => {
  e.preventDefault();
  const success = document.getElementById('success');
  success.hidden = true;
  const invalid = Object.keys(rules).filter(name => !validateField(name));
  if (invalid.length) { form.elements[invalid[0]].focus(); return; }
  form.reset();
  success.hidden = false;
  success.focus();
});
