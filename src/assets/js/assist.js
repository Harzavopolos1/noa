// העוזרת של נועה — site chat widget (talks to noa-assist worker)
(function () {
  var API = 'https://noa-assist.arnavnavon.com/chat';
  var GREETING = 'היי! אני העוזרת הדיגיטלית של האתר 🌿\n\nחשוב לדעת: אני כלי עזר בלבד — לא מטפלת ולא נותנת ייעוץ רפואי או אבחנות, ונועה אינה אחראית לתשובותיי. השיחה נשמרת לצורך שיפור השירות וכדי שנועה תוכל לחזור אליך אם תבקש/י.\n\nבמצוקה חריפה אני לא הכתובת — ער"ן זמינים 24/7 בטלפון 1201.\n\nובכל שאלה על טיפול, על נועה או על איך מתחילים — אני כאן 🙂 במה אפשר לעזור?';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }

  var sid = sessionStorage.getItem('assist_sid');
  if (!sid) {
    sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 's' + Date.now() + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('assist_sid', sid);
  }
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem('assist_hist') || '[]'); } catch (e) {}

  // launcher
  var launcher = el('button', 'assist-float', '<span aria-hidden="true">✨</span><span class="assist-float-label">יש לך שאלה?</span>');
  launcher.setAttribute('aria-label', 'פתיחת צ\'אט עם העוזרת הדיגיטלית');
  document.body.appendChild(launcher);

  // panel
  var panel = el('div', 'assist-panel');
  panel.innerHTML =
    '<div class="assist-head"><div><strong>העוזרת של נועה</strong><span>כלי דיגיטלי · לא ייעוץ מקצועי</span></div><button class="assist-close" aria-label="סגירה">✕</button></div>' +
    '<div class="assist-msgs" role="log" aria-live="polite"></div>' +
    '<form class="assist-form"><input type="text" maxlength="1000" placeholder="כתבו כאן..." aria-label="הודעה לעוזרת"><button type="submit" class="assist-send" aria-label="שליחה">➤</button></form>';
  document.body.appendChild(panel);

  var msgsBox = panel.querySelector('.assist-msgs');
  var form = panel.querySelector('.assist-form');
  var input = form.querySelector('input');

  function addMsg(role, text) {
    var m = el('div', 'assist-msg ' + (role === 'user' ? 'from-user' : 'from-bot'), esc(text));
    msgsBox.appendChild(m);
    msgsBox.scrollTop = msgsBox.scrollHeight;
  }
  function saveHist() {
    try { sessionStorage.setItem('assist_hist', JSON.stringify(history.slice(-60))); } catch (e) {}
  }
  function render() {
    msgsBox.innerHTML = '';
    addMsg('bot', GREETING);
    history.forEach(function (m) { addMsg(m.r, m.t); });
  }

  var open = false;
  function toggle(show) {
    open = show === undefined ? !open : show;
    panel.classList.toggle('open', open);
    launcher.classList.toggle('hidden', open);
    if (open) { render(); setTimeout(function () { input.focus(); }, 150); }
  }
  launcher.addEventListener('click', function () { toggle(true); });
  panel.querySelector('.assist-close').addEventListener('click', function () { toggle(false); });

  var busy = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    history.push({ r: 'user', t: text }); saveHist();
    addMsg('user', text);
    var typing = el('div', 'assist-msg from-bot typing', '···');
    msgsBox.appendChild(typing); msgsBox.scrollTop = msgsBox.scrollHeight;
    busy = true;
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: sid, msg: text, page: window.location.pathname })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        typing.remove();
        var reply = res.reply || 'מתנצלת, משהו השתבש. אפשר ליצור קשר ישירות: 054-455-6248.';
        history.push({ r: 'bot', t: reply }); saveHist();
        addMsg('bot', reply);
      })
      .catch(function () {
        typing.remove();
        addMsg('bot', 'אין חיבור כרגע 🙏 אפשר ליצור קשר ישירות: 054-455-6248 או בוואטסאפ.');
      })
      .finally(function () { busy = false; });
  });
})();
