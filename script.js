const canvas = document.querySelector("#fluid-canvas");
const ctx = canvas.getContext("2d", { alpha: true });
const nav = document.querySelector(".site-nav");
const orb = document.querySelector(".cursor-orb");
const heroFigures = document.querySelector(".hero-figures");
const heroMainImage = document.querySelector("#hero-main-image");
const heroEmblemImage = document.querySelector("#hero-emblem-image");

const imageCandidates = {
  hero: [
    "assets/it-uclu.png",
    "assets/it-uclu.jpg",
    "assets/it üçlü.png",
    "assets/it üçlü.jpg",
    "assets/ittihat-terakki-uclu.png",
    "assets/ittihat-terakki-uclu.jpg",
    "assets/ittihat Terakki üçlü.png",
    "assets/ittihat Terakki üçlü.jpg",
    "assets/ittihat-terakki-üçlü.png",
    "assets/ittihat-terakki-üçlü.jpg",
  ],
  emblem: [
    "assets/it-arma.png",
    "assets/it-arma.jpg",
    "assets/it Arma.png",
    "assets/it Arma.jpg",
    "assets/arma.jpg",
  ],
  ahmed: [
    "assets/ahmed-riza.png",
    "assets/ahmed-riza.jpg",
    "assets/ahmed-rıza.png",
    "assets/ahmed-rıza.jpg",
    "assets/Ahmed Rıza.png",
    "assets/Ahmed Rıza.jpg",
    "assets/arma.jpg",
  ],
};

const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.45,
  tx: window.innerWidth * 0.5,
  ty: window.innerHeight * 0.45,
  active: false,
};

let width = 0;
let height = 0;
let dpr = 1;
let time = 0;

function setFirstWorkingImage(img, candidates) {
  if (!img || !candidates.length) return;

  let index = 0;
  const tryNext = () => {
    if (index >= candidates.length) return;
    img.src = candidates[index];
    index += 1;
  };

  img.addEventListener("error", tryNext);
  tryNext();
}

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = Math.max(window.innerHeight, 640);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawBlob(x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.55, color.replace("0.72", "0.28").replace("0.62", "0.22"));
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFluid() {
  time += 0.008;
  pointer.x += (pointer.tx - pointer.x) * 0.08;
  pointer.y += (pointer.ty - pointer.y) * 0.08;

  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  const cx = width * 0.52;
  const cy = height * 0.42;

  for (let i = 0; i < 8; i += 1) {
    const angle = time * (0.7 + i * 0.04) + i * 0.9;
    const orbitX = Math.cos(angle) * (width * (0.14 + i * 0.006));
    const orbitY = Math.sin(angle * 1.24) * (height * (0.13 + i * 0.004));
    const radius = Math.min(width, height) * (0.13 + (i % 3) * 0.024);
    const color = i % 2 === 0 ? "rgba(143, 31, 24, 0.72)" : "rgba(196, 154, 75, 0.62)";
    drawBlob(cx + orbitX, cy + orbitY, radius, color);
  }

  const pointerRadius = pointer.active ? Math.min(width, height) * 0.26 : Math.min(width, height) * 0.14;
  drawBlob(pointer.x, pointer.y, pointerRadius, "rgba(255, 231, 166, 0.62)");
  drawBlob(pointer.x - 42, pointer.y + 34, pointerRadius * 0.62, "rgba(143, 31, 24, 0.72)");

  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(drawFluid);
}

function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.72);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
    observer.observe(el);
  });
}

function wireTiltCards() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const lean = card.classList.contains("glass-card-left") ? -2.2 : card.classList.contains("glass-card-right") ? 2.2 : 0;

    card.addEventListener("pointerenter", () => {
      if (lean) {
        card.style.transform = `perspective(900px) rotateZ(${lean}deg) translateY(-6px)`;
      }
    });

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) rotateZ(${lean + x * 1.1}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function wirePersonGlow() {
  document.querySelectorAll(".person-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

function wireHeroReveal() {
  if (!heroFigures) return;

  heroFigures.addEventListener("pointerenter", () => {
    pointer.active = true;
    heroFigures.classList.add("is-revealing");
    heroFigures.style.setProperty("--reveal-opacity", "0.78");
  });

  heroFigures.addEventListener("pointermove", (event) => {
    const rect = heroFigures.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    pointer.active = true;
    heroFigures.classList.add("is-revealing");
    heroFigures.style.setProperty("--reveal-opacity", "0.78");
    pointer.tx = event.clientX;
    pointer.ty = event.clientY;
    heroFigures.style.setProperty("--reveal-x", `${xPercent}%`);
    heroFigures.style.setProperty("--reveal-y", `${yPercent}%`);
    heroFigures.style.setProperty("--reveal-size", `${Math.max(210, Math.min(rect.width * 0.24, 340))}px`);
  });

  heroFigures.addEventListener("pointerleave", () => {
    pointer.active = false;
    heroFigures.classList.remove("is-revealing");
    heroFigures.style.setProperty("--reveal-opacity", "0");
  });
}

function wireImageFallbacks() {
  setFirstWorkingImage(heroMainImage, imageCandidates.hero);
  setFirstWorkingImage(heroEmblemImage, imageCandidates.emblem);
  const ahmedImage = document.querySelector('[data-person="ahmed"] img');
  setFirstWorkingImage(ahmedImage, imageCandidates.ahmed);
}

window.addEventListener("pointermove", (event) => {
  pointer.tx = event.clientX;
  pointer.ty = event.clientY;
  if (orb) {
    orb.style.transform = `translate3d(${event.clientX - 120}px, ${event.clientY - 120}px, 0)`;
  }
});

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
updateNav();
wireImageFallbacks();
revealOnScroll();
wireTiltCards();
wirePersonGlow();
wireHeroReveal();
drawFluid();
