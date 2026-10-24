/* Copy/paste guard: blocks copy, cut, paste, drag-drop, right-click and the common shortcuts.
   Typing still works everywhere. This is a deterrent, not real security. */
(function () {
  var stop = function (e) { e.preventDefault(); e.stopPropagation(); toast(); };
  var t;
  function toast() {
    var el = document.getElementById('guard-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'guard-toast';
      el.textContent = 'Copy / paste is disabled — type it yourself!';
      el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#FFD400;border:3px solid #FFD400;padding:10px 16px;font:700 14px system-ui,sans-serif;z-index:99999;border-radius:6px;box-shadow:4px 4px 0 #E11D2E;transition:opacity .2s';
      document.body.appendChild(el);
    }
    el.style.opacity = '1'; clearTimeout(t); t = setTimeout(function () { el.style.opacity = '0'; }, 1600);
  }
  ['copy', 'cut', 'paste', 'drop', 'dragstart', 'contextmenu'].forEach(function (n) {
    document.addEventListener(n, stop, true);
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'v', 'a', 'u', 's'].indexOf(k) > -1) return stop(e);
    if (e.shiftKey && e.key === 'Insert') return stop(e);
    if ((e.ctrlKey || e.metaKey) && e.key === 'Insert') return stop(e);
  }, true);
  document.addEventListener('beforeinput', function (e) {
    if (/^insertFromPaste|^insertFromDrop|^deleteByCut/.test(e.inputType || '')) stop(e);
  }, true);
  var s = document.createElement('style');
  s.textContent = 'body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea{-webkit-user-select:text;user-select:text}@media print{body{user-select:auto}}';
  document.head.appendChild(s);
})();
