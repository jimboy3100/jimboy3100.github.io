/* Partículas conectadas formando linhas fluidas no header.
   As partículas flutuam; ao passar o mouse elas são repelidas (efeito de espalhar).
*/
 (function () {
  function initNetwork(container, opts = {}) {
    if (!container) return;
    // ensure container positioned so absolute canvas won't affect layout
    const cs = getComputedStyle(container);
    if (cs.position === 'static') container.style.position = 'relative';

    let canvas = container.querySelector('.webcanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'webcanvas';
      container.insertBefore(canvas, container.firstChild);
    }

    // ensure canvas is absolutely positioned and won't change layout
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: (opts.zIndex || 0).toString(),
    });

    const ctx = canvas.getContext('2d');

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    const computeCount = () => {
      const area = Math.max(12000, container.clientWidth * container.clientHeight);
      // allow footer to be lighter when opts.light === true
      const divisor = opts.light ? 9000 : 6000;
      return Math.max(10, Math.min(100, Math.floor(area / divisor)));
    };

    let particles = [];

    function createParticles() {
      const count = computeCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * container.clientWidth,
          y: Math.random() * container.clientHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 0.8 + Math.random() * 1.4,
        });
      }
    }

    createParticles();

    const ro = new ResizeObserver(() => {
      resize();
      createParticles();
    });
    ro.observe(container);

    const mouse = { x: 0, y: 0, active: false };
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    container.addEventListener('mouseleave', () => (mouse.active = false));

    function update() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      for (let p of particles) {
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const R = Math.max(50, Math.min(220, Math.hypot(w, h) * 0.06));
          if (dist < R) {
            const force = (1 - dist / R) * 3.2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -0.6; }
        if (p.x > w) { p.x = w; p.vx *= -0.6; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.6; }
        if (p.y > h) { p.y = h; p.vy *= -0.6; }

        p.vx *= 0.995;
        p.vy *= 0.995;
      }
    }

    function draw() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDist = Math.max(50, Math.min(140, Math.hypot(w, h) * 0.06));
      const maxDist2 = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const A = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const B = particles[j];
          const dx = A.x - B.x;
          const dy = A.y - B.y;
          const d2 = dx * dx + dy * dy;
          if (d2 <= maxDist2) {
            const alpha = 0.7 * (1 - Math.sqrt(d2) / maxDist);
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
            ctx.stroke();
          }
        }
      }

      for (let p of particles) {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();
  }

  // initialize on header and footer (if exist)
  const header = document.getElementById('header2');
  const footer = document.querySelector('footer.main_footer');
  if (header) initNetwork(header, { zIndex: 0, light: false });
  if (footer) initNetwork(footer, { zIndex: 0, light: true });
})();