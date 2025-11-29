// Update the Swatch display element (safe DOM access)
function updateSwatchTime() {
  const el = document.getElementById('swatch-time');
  if (!el) return;
  el.textContent = getSwatchTime();
}

// Compute Swatch .beats using UTC + 1 (Biel / UTC+1)
function getSwatchTime() {
  const d = new Date();
  // seconds since UTC midnight including fractional milliseconds
  const utcSeconds = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds() + d.getUTCMilliseconds() / 1000;
  // Biel (UTC+1) seconds since midnight — add 3600s and wrap into 0..86399.999
  const bielSeconds = (utcSeconds + 3600) % 86400;
    const rawBeats = bielSeconds / 86.4;
    // Round to 2 decimals then wrap values >=1000 back to range to avoid transient 1000.00
    let rounded = Math.round(rawBeats * 100) / 100;
    if (rounded >= 1000) rounded = rounded - 1000;
    // 1 beat = 86.4 seconds. Use the rounded value for display
    let beatInteger = Math.floor(rounded) % 1000;
  if (beatInteger < 0) beatInteger += 1000;
  const padded = String(beatInteger).padStart(3, '0');
  return `@${padded}`;
}

// Keep a reference to the interval so we can pause on visibility change
let swatchInterval = null;

function startSwatchClock() {
  // Update once immediately (avoids 1s delay)
  updateSwatchTime();
  // Align next tick to 1-second boundary for stable seconds
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  setTimeout(() => {
    updateSwatchTime();
    swatchInterval = setInterval(updateSwatchTime, 1000);
  }, delay);
}

function stopSwatchClock() {
  if (swatchInterval) {
    clearInterval(swatchInterval);
    swatchInterval = null;
  }
}

// Visibility handling to avoid wasted work when app isn't visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopSwatchClock();
  } else {
    startSwatchClock();
  }
});

// Make the logo/button keyboard-focusable and respond to Enter/OK — useful on TV remotes
function setupRemoteControls() {
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.addEventListener('keydown', (e) => {
      // Arrow keys and Enter are common on remotes
      if (e.key === 'Enter' || e.key === 'OK' || e.keyCode === 13) {
        e.preventDefault();
        showInstallPrompt();
      }
    });
    installBtn.addEventListener('click', showInstallPrompt);
  }

  // Global key handler: allow arrow navigation to focus the install button easily
  window.addEventListener('keydown', (e) => {
    // prevent default browser scroll on arrows in TV browsers
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    // Quick "install" via Enter if the button is visible
    if ((e.key === 'Enter' || e.keyCode === 13) && document.activeElement === document.body) {
      // try to focus install button if present
      if (installBtn) {
        installBtn.focus();
      }
    }
  });
}

// Set up the initial theme
document.body.classList.add('theme-dark');

// Start the clock and remote controls
startSwatchClock();
setupRemoteControls();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile; save the event to trigger later
  event.preventDefault();
  deferredPrompt = event;
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    // Leave visibility/ARIA of the install button to the HTML/CSS defaults
    // The element is visible by default in `index.html` so no JS toggle is needed.
  }
});

// Function to show the installation prompt
function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log('Install prompt result:', choiceResult.outcome);
      deferredPrompt = null;
      // Keep the install button/logo visible even after the prompt.
      // We intentionally do not hide the install button so users can re-open the prompt
      // or use the logo as a persistent affordance.
    });
  }
}