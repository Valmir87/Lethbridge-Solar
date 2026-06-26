/* ══════════════════════════════════════════════════════════
   LETHBRIDGE SOLAR — Main JavaScript
   lethbridgesolar.ca
══════════════════════════════════════════════════════════ */

/* ── Analytics tracking helper ──────────────────────────────
   Safe wrapper — works whether GA4 is loaded or not.
   All events appear in GA4 → Reports → Events
   ────────────────────────────────────────────────────────── */
function track(eventName, params) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params || {});
  }
  // Development logging — remove before launch if preferred
  console.log('[Track]', eventName, params || {});
}

/* ── Auto-track phone & email link clicks ───────────────── */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a');
  if (!a) return;
  if (a.href && a.href.startsWith('tel:'))    track('phone_click',  { link_url: a.href, location: 'auto' });
  if (a.href && a.href.startsWith('mailto:')) track('email_click',  { link_url: a.href, location: 'auto' });
});

/* ══════════════════════════════════════════════════════════
   NAV — scroll behaviour
══════════════════════════════════════════════════════════ */
var nav = document.getElementById('nav');
window.addEventListener('scroll', function () {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════ */
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  if (!menu) return;
  var isOpen = menu.classList.toggle('open');
  track('mobile_menu_toggle', { open: isOpen });
  // Prevent body scroll when menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ══════════════════════════════════════════════════════════
   SAVINGS CALCULATOR
   Inputs  : bill ($/mo), sqft, roof factor, system type
   Outputs : annual savings, payback, system kW, 25yr return
══════════════════════════════════════════════════════════ */
function updateCalc() {
  var billSlider  = document.getElementById('billSlider');
  var sqftSlider  = document.getElementById('sqftSlider');
  var roofSelect  = document.getElementById('roofSelect');
  var typeSelect  = document.getElementById('typeSelect');
  if (!billSlider) return;

  var bill = +billSlider.value;
  var sqft = +sqftSlider.value;
  var roof = +roofSelect.value;
  var type = +typeSelect.value;

  document.getElementById('billOut').textContent = '$' + bill;
  document.getElementById('sqftOut').textContent = sqft.toLocaleString() + ' sq ft';

  // System sizing — Lethbridge: 4.8 peak sun hrs/day
  var peakSunHrs   = 4.8;
  var annualKwh    = (sqft * 8.5) / 1000;                        // rough kWh/yr estimate
  var systemKW     = Math.round(((annualKwh / (peakSunHrs * 365)) * 1000 * roof)) / 100;
  systemKW         = Math.min(Math.max(systemKW, 3), 30);         // clamp 3–30 kW

  // Savings
  var kwhRate      = 0.17;                                        // ATCO residential rate $/kWh
  var annualKwhGen = systemKW * peakSunHrs * 365;
  var annualSav    = Math.round(Math.min(bill * 12 * 0.88, annualKwhGen * kwhRate) * roof);

  // System cost & incentives
  var baseCost     = systemKW * 3100;
  var batteryCost  = type >= 1 ? 14500 : 0;
  var evCost       = type >= 2 ? 1800  : 0;
  var totalCost    = baseCost + batteryCost + evCost;
  var incentives   = Math.round(totalCost * 0.28);                // ~28% combined federal/prov
  var netCost      = totalCost - incentives;
  var payback      = Math.round((netCost / annualSav) * 10) / 10;

  // 25-year return with 3% annual rate escalation
  var lifetime     = 0;
  var remaining    = netCost;
  for (var yr = 1; yr <= 25; yr++) {
    var savYr = annualSav * Math.pow(1.03, yr - 1);
    if (remaining > 0) { remaining -= savYr; }
    else { lifetime += savYr; }
  }
  lifetime = Math.round(lifetime / 1000) * 1000;

  document.getElementById('annualSavings').textContent = '$' + annualSav.toLocaleString();
  document.getElementById('payback').textContent       = payback + ' yrs';
  document.getElementById('systemKW').textContent      = systemKW.toFixed(1) + ' kW';
  document.getElementById('lifetime').textContent      = '$' + lifetime.toLocaleString();
}

// Init on load
if (document.getElementById('billSlider')) updateCalc();

/* ══════════════════════════════════════════════════════════
   QUOTE FORM SUBMISSION
   ➜ Using Formspree — replace YOUR_FORM_ID in index.html
   ➜ On success: hides form, shows thank-you message,
     fires GA4 'generate_lead' conversion event
══════════════════════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  var form    = e.target;
  var btn     = form.querySelector('[type=submit]');
  var success = document.getElementById('formSuccess');

  // Disable button while submitting
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  var formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(function (res) {
    if (res.ok) {
      // ── CONVERSION EVENTS ───────────────────────────────
      track('generate_lead', {
        currency:      'CAD',
        property_type: form.property_type ? form.property_type.value : 'unknown',
        bill_range:    form.monthly_bill  ? form.monthly_bill.value  : 'unknown',
        has_message:   form.message       ? form.message.value.length > 0 : false,
        source:        'website_form'
      });
      track('quote_form_submit', {
        form_location: 'contact_section'
      });
      // Google Ads conversion — uncomment and add your IDs:
      // gtag('event','conversion',{'send_to':'AW-CONVERSION_ID/CONVERSION_LABEL','value':1.0,'currency':'CAD'});
      // ────────────────────────────────────────────────────

      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      btn.disabled    = false;
      btn.textContent = 'Send my free estimate request →';
      alert('Something went wrong. Please call us directly at (403) 123-4567 or email hello@lethbridgesolar.ca');
      track('form_error', { step: 'submit', status: res.status });
    }
  })
  .catch(function () {
    btn.disabled    = false;
    btn.textContent = 'Send my free estimate request →';
    alert('Network error. Please call us directly at (403) 123-4567 or email hello@lethbridgesolar.ca');
    track('form_error', { step: 'network' });
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL-TRIGGERED FADE-UP ANIMATIONS
══════════════════════════════════════════════════════════ */
var fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(function (el) {
  fadeObserver.observe(el);
});

/* ══════════════════════════════════════════════════════════
   TRACKING — Scroll depth
   Fires at 25%, 50%, 75%, 90% of page scroll
══════════════════════════════════════════════════════════ */
var depthTracked = {};
window.addEventListener('scroll', function () {
  var scrollPct = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  [25, 50, 75, 90].forEach(function (d) {
    if (scrollPct >= d && !depthTracked[d]) {
      depthTracked[d] = true;
      track('scroll_depth', { depth: d, depth_threshold: d + '%' });
    }
  });
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   TRACKING — Time on page
   Fires at 30s, 60s, 2min, 5min
   Useful for understanding engagement quality
══════════════════════════════════════════════════════════ */
(function () {
  var milestones  = [30, 60, 120, 300];
  var idx         = 0;
  var startTime   = Date.now();
  var hidden      = false;

  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
  });

  function scheduleNext() {
    if (idx >= milestones.length) return;
    var delay = (milestones[idx] - (idx > 0 ? milestones[idx - 1] : 0)) * 1000;
    setTimeout(function () {
      if (!hidden) {
        track('time_on_page', {
          seconds:            milestones[idx],
          total_elapsed_secs: Math.round((Date.now() - startTime) / 1000)
        });
      }
      idx++;
      scheduleNext();
    }, delay);
  }
  scheduleNext();
})();

/* ══════════════════════════════════════════════════════════
   TRACKING — Section visibility
   Fires when each major section enters the viewport
══════════════════════════════════════════════════════════ */
var sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && entry.target.id) {
      track('section_view', {
        section:    entry.target.id,
        section_pct: Math.round(entry.intersectionRatio * 100)
      });
      sectionObserver.unobserve(entry.target); // fire once per section
    }
  });
}, { threshold: 0.3 });

['calculator','residential','commercial','agricultural','how-it-works',
 'financing','founding','about','quote'].forEach(function (id) {
  var el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ══════════════════════════════════════════════════════════
   TRACKING — CTA button visibility (impression tracking)
   Useful for above-the-fold CTA analysis
══════════════════════════════════════════════════════════ */
var ctaObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var btn = entry.target;
      track('cta_impression', {
        cta_text:     btn.textContent.trim().substring(0, 40),
        cta_location: btn.closest('section') ? (btn.closest('section').id || 'unknown') : 'nav'
      });
      ctaObserver.unobserve(btn);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.btn-sun, .btn-sky').forEach(function (btn) {
  ctaObserver.observe(btn);
});

/* ══════════════════════════════════════════════════════════
   TRACKING — Calculator engagement
   Fires when user has interacted with calculator multiple times
   (indicates high intent)
══════════════════════════════════════════════════════════ */
var calcInteractions = 0;
['billSlider','sqftSlider','roofSelect','typeSelect'].forEach(function (id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('change', function () {
    calcInteractions++;
    if (calcInteractions === 3) {
      track('calculator_engaged', {
        interactions: calcInteractions,
        event_label:  'high_intent'
      });
    }
  });
});

/* ══════════════════════════════════════════════════════════
   TRACKING — Exit intent (desktop only)
   Fires when user moves cursor toward browser chrome
══════════════════════════════════════════════════════════ */
var exitFired = false;
document.addEventListener('mouseleave', function (e) {
  if (!exitFired && e.clientY < 10) {
    exitFired = true;
    track('exit_intent', {
      scroll_depth_pct: Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
    });
  }
});
