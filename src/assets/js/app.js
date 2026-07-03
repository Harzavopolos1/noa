// Mobile nav toggle
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Sticky header shadow on scroll
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
})();

// Scroll reveal
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Contact form — own lead endpoint (Cloudflare Worker: noa-leads)
function showFormError(msg) {
  if (!msg) return;
  msg.hidden = false;
  msg.classList.remove('ok');
  msg.classList.add('error');
  msg.innerHTML = 'השליחה לא הצליחה כרגע. מוזמנים ליצור קשר ישירות: <a href="tel:+972544556248">054-455-6248</a> או <a href="https://wa.me/972544556248" target="_blank" rel="noopener">בוואטסאפ</a>.';
}

function handleContact(e) {
  e.preventDefault();
  var form = e.target;
  var msg = form.querySelector('.form-msg');
  var btn = form.querySelector('button[type="submit"]');
  var data = new FormData(form);
  data.set('page', window.location.pathname);

  var orig = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'שולחת…'; }

  fetch('https://noa-leads.arnavnavon.com/', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (res.success) {
        form.reset();
        if (msg) {
          msg.hidden = false;
          msg.classList.remove('error');
          msg.classList.add('ok');
          msg.textContent = 'תודה! פנייתך התקבלה — אחזור אליך תוך יום עסקים.';
        }
      } else {
        showFormError(msg);
      }
    })
    .catch(function () { showFormError(msg); })
    .finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    });

  return false;
}
