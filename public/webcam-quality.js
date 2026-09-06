// Fast / Quality capture toggle. Lives outside control.js so we don't
// rewrite that file. Intercepts getUserMedia video constraints and
// restarts the existing Start/Stop webcam buttons when quality changes.
(() => {
  'use strict';

  const PRESETS = {
    fast: { width: 640, height: 480 },
    quality: { width: 1280, height: 720 },
  };

  function loadQuality() {
    try {
      const saved = JSON.parse(localStorage.getItem('as-adventurer-settings') || '{}');
      return saved.webcamQuality === 'quality' ? 'quality' : 'fast';
    } catch {
      return 'fast';
    }
  }

  function saveQuality(quality) {
    try {
      const saved = JSON.parse(localStorage.getItem('as-adventurer-settings') || '{}');
      saved.webcamQuality = quality;
      localStorage.setItem('as-adventurer-settings', JSON.stringify(saved));
    } catch { /* ignore */ }
  }

  let webcamQuality = loadQuality();

  function updateButtons() {
    document.querySelectorAll('.quality-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.quality === webcamQuality);
    });
  }

  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = (constraints) => {
    if (constraints && constraints.video) {
      const preset = PRESETS[webcamQuality] || PRESETS.fast;
      const video = typeof constraints.video === 'object' ? { ...constraints.video } : {};
      video.width = { ideal: preset.width };
      video.height = { ideal: preset.height };
      if (!video.frameRate) video.frameRate = { ideal: 30 };
      constraints = { ...constraints, video };
    }
    return originalGetUserMedia(constraints);
  };

  function cameraIsRunning() {
    const stop = document.getElementById('btn-stop-webcam');
    return !!(stop && stop.style.display !== 'none');
  }

  function restartWebcam() {
    const start = document.getElementById('btn-start-webcam');
    const stop = document.getElementById('btn-stop-webcam');
    if (!start || !stop) return;
    stop.click();
    setTimeout(() => start.click(), 150);
  }

  document.querySelectorAll('.quality-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.quality;
      if (!PRESETS[next] || next === webcamQuality) {
        updateButtons();
        return;
      }
      webcamQuality = next;
      saveQuality(next);
      updateButtons();
      if (cameraIsRunning()) restartWebcam();
    });
  });

  updateButtons();
})();
