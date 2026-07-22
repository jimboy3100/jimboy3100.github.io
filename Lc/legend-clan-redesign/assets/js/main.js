/* ==========================================================================
   LEGEND CLAN — main.js
   Módulos: Loader · Tema · Navbar · Menu Mobile · Canvas (células) ·
   Scroll Reveal · Contador · Membros (filtro/busca) · Galeria (lightbox) ·
   Formulário · Voltar ao topo
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Loader ---------- */
  const Loader = {
    init() {
      const el = document.getElementById("loader");
      if (!el) return;
      window.addEventListener("load", () => {
        setTimeout(() => el.classList.add("hidden"), 350);
      });
    },
  };

  /* ---------- Tema (Dark/Light) ---------- */
  const Theme = {
    key: "lc-theme",
    init() {
      const saved = localStorage.getItem(this.key) ||
        (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", saved);
      document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => this.toggle());
      });
    },
    toggle() {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(this.key, next);
    },
  };

  /* ---------- Navbar (estado ao rolar + link ativo) ---------- */
  const Navbar = {
    init() {
      this.nav = document.getElementById("navbar");
      this.links = document.querySelectorAll(".nav-links a, .mobile-menu a");
      this.sections = [...document.querySelectorAll("main section[id]")];
      window.addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.onScroll();
    },
    onScroll() {
      if (!this.nav) return;
      this.nav.classList.toggle("scrolled", window.scrollY > 12);

      let current = "";
      const y = window.scrollY + window.innerHeight * 0.3;
      for (const sec of this.sections) {
        if (y >= sec.offsetTop) current = sec.id;
      }
      this.links.forEach((a) => {
        const match = a.getAttribute("href") === `#${current}`;
        a.classList.toggle("active", match);
      });
    },
  };

  /* ---------- Menu Mobile ---------- */
  const MobileMenu = {
    init() {
      this.menu = document.getElementById("mobileMenu");
      this.openBtn = document.getElementById("menuToggle");
      this.closeBtn = document.getElementById("menuClose");
      if (!this.menu || !this.openBtn) return;
      this.openBtn.addEventListener("click", () => this.open());
      this.closeBtn?.addEventListener("click", () => this.close());
      this.menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => this.close()));
    },
    open() { this.menu.classList.add("open"); document.body.style.overflow = "hidden"; },
    close() { this.menu.classList.remove("open"); document.body.style.overflow = ""; },
  };

  /* ---------- Canvas: células flutuantes (assinatura visual — Agar.io) ---------- */
  const CellCanvas = {
    init() {
      this.canvas = document.getElementById("heroCanvas");
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.cells = [];
      this.resize();
      this.spawn();
      window.addEventListener("resize", () => this.resize());
      this.loop();
    },
    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = rect.width;
      this.h = rect.height;
      this.canvas.width = this.w * this.dpr;
      this.canvas.height = this.h * this.dpr;
      this.canvas.style.width = this.w + "px";
      this.canvas.style.height = this.h + "px";
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },
    spawn() {
      const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
      this.isLight = isLight;
      const colors = ["139,107,255", "52,224,196", "255,138,91"];
      const count = window.innerWidth < 760 ? 12 : 22;
      for (let i = 0; i < count; i++) {
        const r = 14 + Math.random() * 46;
        this.cells.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          r,
          baseR: r,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          color: colors[i % colors.length],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    },
    loop() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const alphaBase = this.isLight() ? 0.10 : 0.16;

      for (const c of this.cells) {
        c.x += c.vx;
        c.y += c.vy;
        c.pulse += 0.012;
        if (c.x < -c.r) c.x = this.w + c.r;
        if (c.x > this.w + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = this.h + c.r;
        if (c.y > this.h + c.r) c.y = -c.r;

        const r = c.baseR + Math.sin(c.pulse) * 3;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        grad.addColorStop(0, `rgba(${c.color},${alphaBase + 0.14})`);
        grad.addColorStop(1, `rgba(${c.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c.color},${alphaBase + 0.22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // linhas de conexão entre células próximas (efeito "membrana")
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = i + 1; j < this.cells.length; j++) {
          const a = this.cells[i], b = this.cells[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(139,107,255,${(1 - dist / 160) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.loop());
    },
  };

  /* ---------- Scroll Reveal ---------- */
  const Reveal = {
    init() {
      const items = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window) || items.length === 0) {
        items.forEach((el) => el.classList.add("in"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );
      items.forEach((el) => io.observe(el));
    },
  };

  /* ---------- Contador animado (estatísticas do hero) ---------- */
  const Counters = {
    init() {
      const els = document.querySelectorAll("[data-count]");
      if (!els.length) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.animate(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      els.forEach((el) => io.observe(el));
    },
    animate(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
  };

  /* ---------- Membros: busca + filtro por cargo ---------- */
  const Members = {
    init() {
      this.grid = document.getElementById("membersGrid");
      this.input = document.getElementById("memberSearch");
      this.chips = document.querySelectorAll(".filter-chip");
      this.empty = document.getElementById("membersEmpty");
      if (!this.grid) return;
      this.cards = [...this.grid.querySelectorAll(".member-card")];
      this.activeRole = "all";

      this.input?.addEventListener("input", () => this.apply());
      this.chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          this.chips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.activeRole = chip.dataset.role;
          this.apply();
        });
      });
    },
    apply() {
      const q = (this.input?.value || "").trim().toLowerCase();
      let visible = 0;
      this.cards.forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        const role = card.dataset.role;
        const matchesText = name.includes(q);
        const matchesRole = this.activeRole === "all" || role === this.activeRole;
        const show = matchesText && matchesRole;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (this.empty) this.empty.style.display = visible === 0 ? "block" : "none";
    },
  };

  /* ---------- Galeria: lightbox ---------- */
  const Gallery = {
    init() {
      this.items = document.querySelectorAll(".gallery-item img");
      this.lightbox = document.getElementById("lightbox");
      this.lightboxImg = document.getElementById("lightboxImg");
      this.closeBtn = document.getElementById("lightboxClose");
      if (!this.lightbox) return;

      this.items.forEach((img) => {
        img.addEventListener("click", () => this.open(img.src, img.alt));
      });
      this.closeBtn?.addEventListener("click", () => this.close());
      this.lightbox.addEventListener("click", (e) => {
        if (e.target === this.lightbox) this.close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    },
    open(src, alt) {
      this.lightboxImg.src = src;
      this.lightboxImg.alt = alt;
      this.lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    },
    close() {
      this.lightbox.classList.remove("show");
      document.body.style.overflow = "";
    },
  };

  /* ---------- Formulário de contato ---------- */
  const ContactForm = {
    init() {
      this.form = document.getElementById("contactForm");
      this.fileInput = document.getElementById("arquivo");
      this.fileLabel = document.getElementById("fileName");
      if (this.fileInput) {
        this.fileInput.addEventListener("change", () => {
          this.fileLabel.textContent = this.fileInput.files.length
            ? this.fileInput.files[0].name
            : "Nenhum arquivo escolhido";
        });
      }
    },
  };

  /* ---------- Voltar ao topo ---------- */
  const BackToTop = {
    init() {
      this.btn = document.getElementById("backToTop");
      if (!this.btn) return;
      window.addEventListener("scroll", () => {
        this.btn.classList.toggle("show", window.scrollY > 480);
      }, { passive: true });
      this.btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    Loader.init();
    Theme.init();
    Navbar.init();
    MobileMenu.init();
    CellCanvas.init();
    Reveal.init();
    Counters.init();
    Members.init();
    Gallery.init();
    ContactForm.init();
    BackToTop.init();
  });
})();
