'use strict';

(function () {
  var combined = document.getElementById('office-gps-combined');
  var btn = document.getElementById('copy-gps-btn');
  if (!combined || !btn) return;

  var text = combined.textContent.trim();

  btn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var label = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied';
        setTimeout(function () {
          btn.innerHTML = label;
        }, 2000);
      });
    } else {
      window.prompt('Copy GPS coordinates:', text);
    }
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
