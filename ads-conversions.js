/* Google Ads lead tracking (AW-10990620522) — RealScout signup clicks + phone taps.
   Shared across Dr. Jan Duffy's office sites. Safe to load once per page. */
(function () {
  if (window.__djdAdsConv) return;
  window.__djdAdsConv = true;
  var ID = 'AW-10990620522';
  var REALSCOUT = 'AW-10990620522/oggzCNmKmKUdEOqe3vgo';
  var PHONE = 'AW-10990620522/PHRcCNyKmKUdEOqe3vgo';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    window.gtag('js', new Date());
  }
  window.gtag('config', ID);
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var t = /realscout\.com/i.test(h) ? REALSCOUT : /^tel:/i.test(h) ? PHONE : null;
    if (t) window.gtag('event', 'conversion', { send_to: t, transport_type: 'beacon' });
  }, true);
})();
