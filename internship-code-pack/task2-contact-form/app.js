/**
 * Contact Form: basic client-side validation and UX feedback
 */
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setError(input, message){
  input.setAttribute('aria-invalid', 'true');
  let err = input.parentElement.querySelector('.error-text');
  if(!err){
    err = document.createElement('div');
    err.className = 'error-text';
    input.parentElement.appendChild(err);
  }
  err.textContent = message;
}

function clearError(input){
  input.removeAttribute('aria-invalid');
  const err = input.parentElement.querySelector('.error-text');
  if(err) err.remove();
}

function isEmail(value){
  // Simple robust pattern for demonstration
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  statusEl.textContent = '';
  const data = new FormData(form);

  const fullName = form.fullName;
  const email = form.email;
  const subject = form.subject;
  const message = form.message;

  // reset errors
  [fullName, email, subject, message].forEach(clearError);

  let ok = true;

  if(!fullName.value.trim()){
    setError(fullName, 'Full name is required.');
    ok = false;
  }
  if(!email.value.trim() || !isEmail(email.value)){
    setError(email, 'Please enter a valid email address.');
    ok = false;
  }
  if(!subject.value.trim()){
    setError(subject, 'Subject is required.');
    ok = false;
  }
  if(!message.value.trim() || message.value.trim().length < 10){
    setError(message, 'Message must be at least 10 characters.');
    ok = false;
  }

  if(!ok){
    statusEl.textContent = 'Please fix the highlighted fields.';
    return;
  }

  // Simulate sending (demo)
  statusEl.textContent = 'Sending...';
  setTimeout(()=>{
    statusEl.textContent = '✅ Message sent successfully (demo).';
    form.reset();
  }, 900);
});
