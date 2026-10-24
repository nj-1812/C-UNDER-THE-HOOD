/* Copy/paste guard: blocks copy, cut, paste, drag-drop, right-click and the common shortcuts.
   Typing still works in actual text inputs. This is a deterrent, not real security. */
(function () {
  var toastTimer;

  function showGuardToast() {
    var el = document.getElementById('guard-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'guard-toast';
      el.textContent = 'Copy / paste is disabled — type it yourself!';
      el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#FFD400;border:3px solid #FFD400;padding:10px 16px;font:700 14px system-ui,sans-serif;z-index:99999;border-radius:10px;box-shadow:0 8px 22px rgba(0,0,0,.35);opacity:0;transition:opacity .2s;';
      document.body.appendChild(el);
    }
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 1600);
  }

  function stop(e) {
    var target = e && e.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    var editable = !!(target && (target.isContentEditable || tag === 'input' || tag === 'textarea'));

    if (editable) return;

    e.preventDefault();
    e.stopPropagation();
    showGuardToast();
  }

  ['copy', 'cut', 'paste', 'drop', 'dragstart', 'contextmenu'].forEach(function (name) {
    document.addEventListener(name, stop, true);
  });

  document.addEventListener('keydown', function (e) {
    var key = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'v', 'a', 'u', 's'].indexOf(key) > -1) {
      return stop(e);
    }
    if (e.shiftKey && e.key === 'Insert') return stop(e);
    if ((e.ctrlKey || e.metaKey) && e.key === 'Insert') return stop(e);
  }, true);

  document.addEventListener('beforeinput', function (e) {
    if (/^insertFromPaste|^insertFromDrop|^deleteByCut/.test(e.inputType || '')) {
      stop(e);
    }
  }, true);

  var style = document.createElement('style');
  style.id = 'copy-guard-style';
  style.textContent = 'html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable="true"]{-webkit-user-select:text;user-select:text}@media print{html,body{user-select:auto;-webkit-user-select:auto}}';
  document.head.appendChild(style);
})();
