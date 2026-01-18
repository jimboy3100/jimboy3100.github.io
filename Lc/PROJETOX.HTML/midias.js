document.addEventListener('DOMContentLoaded', () => {
  const mediaSection = document.getElementById('midia');
  if (!mediaSection) return;

  const sourceWrapper = mediaSection.querySelector('.custom p');
  if (!sourceWrapper) return;

  const imgs = Array.from(sourceWrapper.querySelectorAll('img'));
  if (!imgs.length) return;
  // Create continuous marquee structure (duplicate content for seamless loop)
  const marqueeWrap = document.createElement('div');
  marqueeWrap.className = 'media-marquee';

  const track = document.createElement('div');
  track.className = 'marquee-track';

  imgs.forEach((img) => {
    const cloned = img.cloneNode(true);
    cloned.removeAttribute('width');
    cloned.removeAttribute('height');
    track.appendChild(cloned);
  });

  // duplicate the track content to create seamless loop
  const cloneNodes = Array.from(track.children).map(n => n.cloneNode(true));
  cloneNodes.forEach(n => track.appendChild(n));

  marqueeWrap.appendChild(track);

  // insert marquee and remove original images wrapper
  sourceWrapper.parentElement.insertBefore(marqueeWrap, sourceWrapper);
  sourceWrapper.remove();

  // OPTIONAL: reduce motion for users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    track.style.animationDuration = '0s';
  } else {
    // slower speed: 30s per loop (you can adjust)
    track.style.animationDuration = '30s';
  }

  // Continuous marquee interaction: show floating preview (clone) on hover
  const trackEl = track;
  const trackImages = Array.from(trackEl.querySelectorAll('img'));
  let activeClone = null;

  function restoreClone() {
    if (!activeClone) return;
    const clone = activeClone;
    const origin = clone._originRect;
    // animate back to origin
    if (origin) {
      clone.style.left = origin.left + 'px';
      clone.style.top = origin.top + 'px';
      clone.style.width = origin.width + 'px';
      clone.style.height = origin.height + 'px';
      clone.style.borderRadius = origin.radius || '6px';
      // after transition remove (with fallback)
      let fallbackRestore = setTimeout(() => {
        if (clone && clone.parentElement) clone.parentElement.removeChild(clone);
        if (clone._sourceImg) clone._sourceImg._previewLocked = Date.now();
      }, 900);
      const clean = () => {
        clearTimeout(fallbackRestore);
        if (clone && clone.parentElement) clone.parentElement.removeChild(clone);
        if (clone._sourceImg) clone._sourceImg._previewLocked = Date.now();
      };
      clone.addEventListener('transitionend', clean, { once: true });
    } else {
      if (clone && clone.parentElement) clone.parentElement.removeChild(clone);
    }
    trackEl.style.animationPlayState = '';
    activeClone = null;
  }

  const PREVIEW_DEFAULT = 400;
  const PREVIEW_LARGE = 600;

  trackImages.forEach(imgEl => {
    imgEl.style.cursor = 'zoom-in';
    // ensure we use pointer events to avoid child enter/leave quirks
    imgEl.addEventListener('pointerenter', (ev) => {
      // debounce per-image to avoid rapid re-opens when track moves
      const now = Date.now();
      if (imgEl._previewLocked && (now - imgEl._previewLocked) < 800) return;
      if (activeClone) return; // global guard
      imgEl._previewLocked = now;

      // pause marquee
      trackEl.style.animationPlayState = 'paused';

      // create clone positioned at original image rect
      const rect = imgEl.getBoundingClientRect();
      const clone = imgEl.cloneNode(true);
      clone.className = 'media-preview';
      clone.style.position = 'fixed';
      clone.style.left = rect.left + 'px';
      clone.style.top = rect.top + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.zIndex = 100000;
      clone.style.opacity = '1';
      clone._originRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius: imgEl.style.borderRadius };
      clone._sourceImg = imgEl;
      document.body.appendChild(clone);
      activeClone = clone;

      // animate to center with size depending on Shift key (large) or default
      requestAnimationFrame(() => {
        const useLarge = ev.shiftKey;
        const targetW = useLarge ? PREVIEW_LARGE : PREVIEW_DEFAULT;
        const targetH = useLarge ? PREVIEW_LARGE : PREVIEW_DEFAULT;
        const left = Math.max(8, (window.innerWidth - targetW) / 2);
        const top = Math.max(8, (window.innerHeight - targetH) / 2);
        clone.style.left = left + 'px';
        clone.style.top = top + 'px';
        clone.style.width = targetW + 'px';
        clone.style.height = targetH + 'px';
        clone.style.borderRadius = '8px';
      });

      // if user moves from original to outside (not into clone), restore after small delay
      imgEl.addEventListener('pointerleave', function onLeave(e) {
        setTimeout(() => {
          const elAt = document.elementFromPoint(e.clientX, e.clientY);
          if (activeClone && (elAt === activeClone || activeClone.contains(elAt))) {
            // pointer moved into clone — wait for clone pointerleave
            activeClone.addEventListener('pointerleave', () => restoreClone(), { once: true });
          } else {
            restoreClone();
          }
        }, 120);
        imgEl.removeEventListener('pointerleave', onLeave);
      });

      // dismiss clone permanently by animating off-screen
      function dismissClone() {
        if (!activeClone) return;
        const cloneNow = activeClone;
        // move off-screen to right and fade
        const offLeft = window.innerWidth + 200;
        cloneNow.style.left = offLeft + 'px';
        cloneNow.style.opacity = '0';

        // fallback remover in case transitionend doesn't fire
        let fallback = setTimeout(() => {
          if (cloneNow && cloneNow.parentElement) cloneNow.parentElement.removeChild(cloneNow);
          trackEl.style.animationPlayState = '';
          if (cloneNow._sourceImg) cloneNow._sourceImg._previewLocked = Date.now();
          if (documentClickHandler) document.removeEventListener('click', documentClickHandler);
          activeClone = null;
        }, 900);

        const remover = () => {
          clearTimeout(fallback);
          if (cloneNow && cloneNow.parentElement) cloneNow.parentElement.removeChild(cloneNow);
          trackEl.style.animationPlayState = '';
          if (cloneNow._sourceImg) cloneNow._sourceImg._previewLocked = Date.now();
          if (documentClickHandler) document.removeEventListener('click', documentClickHandler);
          activeClone = null;
        };
        cloneNow.addEventListener('transitionend', remover, { once: true });
      }

      // click handler attached to document to dismiss
      const documentClickHandler = (e) => {
        // if clicked inside clone, ignore here (clone has its own handler)
        if (activeClone && (activeClone === e.target || activeClone.contains(e.target))) return;
        dismissClone();
      };
      document.addEventListener('click', documentClickHandler);

      // clicking the clone itself dismisses immediately
      clone.addEventListener('click', (ev) => {
        ev.stopPropagation();
        dismissClone();
      });
    });
  });
});
