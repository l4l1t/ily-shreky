// ============================================
// SHARED SCRIPT - script.js
// Contains all reusable logic across pages
// ============================================

// --- CENTRAL COLOR PALETTE SYSTEM (Cohesive CRT/Y2K with Black Domination) ---
const COLORS = {
  black: '#04060F',
  iceBlue: '#A8D8EA',
  lavender: '#7BB8D4',
  deepRose: '#D4688A',
  darkBase: '#080F1A',
  offWhite: '#E8EEF4',
  brightCyan: '#1A3A5C',
  softMauve: '#B84F70'
};

const COLOR_PALETTE = {
  heartBurst: [COLORS.iceBlue, COLORS.deepRose, COLORS.brightCyan, COLORS.lavender],
  tunnel: [COLORS.lavender, COLORS.softMauve, COLORS.iceBlue, COLORS.deepRose],
  particles: [COLORS.iceBlue, COLORS.deepRose, COLORS.brightCyan, COLORS.lavender]
};

// --- Generic Minecraft Heart Renderer (ThreeJS) ---
function runHeartLogic(containerId) {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById(containerId);
  if (!container) return;

  const CONFIG = { color: 0xe31b23, scale: 0.8 };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 18;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.margin = '0 auto';
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  const heartShape = [
    "001101100", "011111110", "111111111", "111111111",
    "011111110", "001111100", "000111000", "000010000"
  ];
  const voxelSize = 1;
  const geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
  const materials = [
    new THREE.MeshStandardMaterial({ color: COLORS.deepRose, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: COLORS.softMauve, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: COLORS.lavender, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: COLORS.iceBlue, roughness: 0.2 }),
  ];
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 2 }); // Intentional white contrast

  const offsetX = (heartShape[0].length * voxelSize) / 2;
  const offsetY = (heartShape.length * voxelSize) / 2;
  const depth = 2;

  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < heartShape.length; y++) {
      for (let x = 0; x < heartShape[y].length; x++) {
        if (heartShape[y][x] === '1') {
          const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
          const voxel = new THREE.Mesh(geometry, randomMaterial);
          voxel.position.set(
            x * voxelSize - offsetX + 0.5,
            (heartShape.length - y) * voxelSize - offsetY - 0.5,
            z * voxelSize - (depth * voxelSize / 2) + 0.5
          );
          heartGroup.add(voxel);
          voxel.add(new THREE.LineSegments(edgesGeometry, edgesMaterial));
        }
      }
    }
  }

  heartGroup.rotation.y = -0.2;

  let time = 0;
  let glitchCounter = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.02;
    glitchCounter++;
    
    const beat = 1 + Math.max(0, Math.sin(time * 2.5) * 0.15);
    heartGroup.scale.set(beat, beat, beat);
    heartGroup.rotation.y = Math.sin(time * 0.5) * 0.3;
    
    // Random glitch distortion every 120 frames
    if (glitchCounter % 120 === 0) {
      heartGroup.rotation.z += (Math.random() - 0.5) * 0.1;
      setTimeout(() => { heartGroup.rotation.z = 0; }, 50);
    }
    
    renderer.render(scene, camera);
  }
  animate();

  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  resizeObserver.observe(container);
}

// --- Device detection ---
const isLowEndDevice = navigator.deviceMemory && navigator.deviceMemory <= 2;
const particleCount = isLowEndDevice ? 20 : 40;

// --- Heart Burst Effect ---
function createHeartBurst(x, y) {
  const heartCount = 8;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    const color = COLOR_PALETTE.heartBurst[Math.floor(Math.random() * COLOR_PALETTE.heartBurst.length)];
    const encodedColor = encodeURIComponent(color);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 13' shape-rendering='crispEdges'><path fill='${encodedColor}' d='M3 0h3v1h1v1h1V1h1V0h3v1h1v1h1v4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V2h1V1h1V0z'/></svg>`;
    const size = Math.random() * 40 + 40; // large

    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size * 13 / 15}px;
      background-image: url("data:image/svg+xml;utf8,${svg}");
      background-size: contain;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.5));
    `;

    document.body.appendChild(heart);

    const angle = (Math.PI * 2 * i) / heartCount + (Math.random() - 0.5) * 0.3;
    const distance = Math.random() * 150 + 150;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance - 30;
    const rotation = (Math.random() - 0.5) * 360;

    heart.animate([
      { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1, offset: 0 },
      { transform: `translate(${targetX}px, ${targetY}px) scale(1) rotate(${rotation}deg)`, opacity: 1, offset: 0.8 },
      { transform: `translate(${targetX}px, ${targetY}px) scale(1) rotate(${rotation}deg)`, opacity: 0, offset: 1 }
    ], {
      duration: 2000 + Math.random() * 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    }).onfinish = () => heart.remove();
  }
}

// --- Mega Heart Burst ---
function createMegaHeartBurst(x, y) {
  const heartCount = 35;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    const color = COLOR_PALETTE.heartBurst[Math.floor(Math.random() * COLOR_PALETTE.heartBurst.length)];
    const encodedColor = encodeURIComponent(color);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 13' shape-rendering='crispEdges'><path fill='${encodedColor}' d='M3 0h3v1h1v1h1V1h1V0h3v1h1v1h1v4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V2h1V1h1V0z'/></svg>`;
    const size = Math.random() * 80 + 60; // much bigger

    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size * 13 / 15}px;
      background-image: url("data:image/svg+xml;utf8,${svg}");
      background-size: contain;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: 99999;
      user-select: none;
      filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.4));
    `;
    document.body.appendChild(heart);

    const angle = (Math.PI * 2 * i) / heartCount + (Math.random() - 0.5) * 0.5;
    const distance = 350 + Math.random() * 400;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance - 60;

    const animation = heart.animate([
      { transform: 'translate(-50%, -50%) scale(0.1) rotate(0deg)', opacity: 1, offset: 0 },
      { transform: `translate(${endX - x - 15}px, ${endY - y - 15}px) scale(1.8) rotate(${Math.random() * 1080}deg)`, opacity: 1, offset: 0.8 },
      { transform: `translate(${endX - x - 15}px, ${endY - y - 15}px) scale(1.8) rotate(${Math.random() * 1080}deg)`, opacity: 0, offset: 1 }
    ], {
      duration: 2000 + Math.random() * 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => { if (heart.parentNode) heart.remove(); };
  }
}

// --- Timer with Enhancements ---
const startDate = new Date('2026-03-10T00:00:00').getTime();
let lastDayValue = 0;

function updateTimer() {
  const now = new Date().getTime();
  const difference = now - startDate;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const daysEl = document.getElementById('days');

  if (daysEl) {
    const formattedDays = days.toString().padStart(2, '0');
    daysEl.textContent = formattedDays;
    applyCRTEffect(daysEl);
    
    // Pulse animation every 10 days
    if (days > lastDayValue && days % 10 === 0) {
      daysEl.style.animation = 'none';
      setTimeout(() => {
        daysEl.style.animation = 'pixelPulse 0.6s ease-out';
      }, 10);
      lastDayValue = days;
    }
  }
}

function startTimer() {
  updateTimer();
  setInterval(updateTimer, 1000);
}

// --- Music Modal ---
function openMusicModal() {
  const modal = document.getElementById('musicModal');
  if (modal) modal.classList.add('active');
}

function closeMusicModal() {
  const modal = document.getElementById('musicModal');
  if (modal) modal.classList.remove('active');
}

// --- Scroll Indicator ---
const scrollIndicator = document.getElementById('scrollIndicator');

function handleScroll() {
  if (scrollIndicator && window.scrollY > 40) {
    scrollIndicator.classList.add('hidden');
  }
}

function resetScrollIndicator() {
  if (scrollIndicator) scrollIndicator.classList.remove('hidden');
  window.scrollTo(0, 0);
}

window.addEventListener('scroll', handleScroll, { passive: true });

// --- CRT/Y2K Glitch Effect System ---
function applyCRTEffect(element) {
  if (!element) return;
  element.style.textShadow = '2px 0 #FF0000, -2px 0 #0000FF, 0 0 4px rgba(0,0,0,0.3)';
  element.style.filter = 'contrast(1.1)';
}

function createGlitchEffect() {
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch-effect';
  glitchOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    opacity: 0.03;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.5) 2px,
      rgba(0,0,0,0.5) 4px
    );
    animation: glitchFlicker 0.3s infinite;
  `;
  document.body.appendChild(glitchOverlay);
}

function addScreenFlicker() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitchFlicker {
      0% { opacity: 0.02; }
      50% { opacity: 0.05; }
      100% { opacity: 0.02; }
    }
    @keyframes chromaticAberration {
      0%, 100% { text-shadow: 0 0 0 rgba(255,0,0,0); }
      50% { text-shadow: 2px 0 #FF0000, -2px 0 #0000FF; }
    }
  `;
  document.head.appendChild(style);
}

function addVHSDistortion(element) {
  if (!element) return;
  element.style.filter = 'hue-rotate(-5deg) saturate(1.1)';
  element.style.letterSpacing = '0.05em';
}

// --- Lazy Load ---
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// --- Ambient Interaction Animations ---
function initGhostCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const ghost = document.createElement('div');
  ghost.style.cssText = `
    position: fixed; pointer-events: none; z-index: 99999;
    width: 18px; height: 18px; border-radius: 50%;
    background: radial-gradient(circle, rgba(168,216,234,0.6) 0%, rgba(168,216,234,0) 70%);
    transition: transform 0.08s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(ghost);

  const trail = [];
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 99998;
      width: ${14 - i * 1.5}px; height: ${14 - i * 1.5}px; border-radius: 50%;
      background: rgba(168,216,234,${0.35 - i * 0.04});
      mix-blend-mode: screen;
      transition: left ${0.06 + i * 0.025}s ease, top ${0.06 + i * 0.025}s ease;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', (e) => {
    ghost.style.left = e.clientX - 9 + 'px';
    ghost.style.top = e.clientY - 9 + 'px';
    trail.forEach((dot, i) => {
      setTimeout(() => {
        dot.style.left = e.clientX - (7 - i * 0.75) + 'px';
        dot.style.top = e.clientY - (7 - i * 0.75) + 'px';
      }, i * 20);
    });
  }, { passive: true });
}

function initTitleGlitch() {
  const titles = document.querySelectorAll('.title');
  if (!titles.length) return;
  const chars = '█▓▒░▀▄▌▐';
  titles.forEach(title => {
    const originalInnerHTML = title.innerHTML;
    const originalText = title.textContent;
    let frame = 0;

    const glitch = setInterval(() => {
      if (frame > 12) {
        title.innerHTML = originalInnerHTML;
        clearInterval(glitch);
        return;
      }
      title.textContent = originalText.split('').map((c) =>
        Math.random() < 0.15 ? chars[Math.floor(Math.random() * chars.length)] : c
      ).join('');
      frame++;
    }, 80);
  });
}

function initStarBorder(btnId) {
  const btn = document.getElementById(btnId);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!btn) return;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';

  const intervalId = setInterval(() => {
    if (!btn.isConnected) {
      clearInterval(intervalId);
      return;
    }
    const star = document.createElement('div');
    const size = Math.random() * 4 + 2;
    star.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: #A8D8EA;
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: star-fade 0.8s ease-out forwards;
      box-shadow: 0 0 ${size * 2}px rgba(168,216,234,0.8);
    `;
    btn.appendChild(star);
    setTimeout(() => star.remove(), 800);
  }, 180);
}

function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 999999;
    background: #04060F;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(overlay);

  window.addEventListener('load', () => {
    overlay.style.opacity = '0';
  });

  document.querySelectorAll('a.btn').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) return;
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
}

function initPromiseParticles() {
  const container = document.querySelector('#step-promises');
  if (!container) return;
  const layer = document.createElement('div');
  layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;';
  container.appendChild(layer);

  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(168,216,234,${Math.random() * 0.4 + 0.1});
      left:${Math.random() * 100}%;
      bottom:${Math.random() * 100}%;
      animation: drift-up ${12 + Math.random() * 16}s linear infinite;
      animation-delay: -${Math.random() * 20}s;
      box-shadow: 0 0 ${size * 3}px rgba(168,216,234,0.3);
    `;
    layer.appendChild(p);
  }
}

function initHeartbeatTimer() {
  const val = document.getElementById('days');
  if (!val) return;

  setInterval(() => {
    val.animate([
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.18)', filter: 'brightness(1.4)' },
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.09)', filter: 'brightness(1.2)' },
      { transform: 'scale(1)', filter: 'brightness(1)' },
    ], { duration: 800, easing: 'ease-in-out' });
  }, 2000);
}

function initTypewriter() {
  const caption = document.querySelector('.caption');
  if (!caption || caption.dataset.typed === 'true') return;
  if (caption.children.length) return;
  const text = caption.textContent;
  const chars = Array.from(text);
  caption.textContent = '';
  caption.style.borderRight = '2px solid #A8D8EA';
  caption.style.whiteSpace = 'pre-wrap';
  caption.dataset.typed = 'true';

  let i = 0;
  const type = () => {
    if (i < chars.length) {
      caption.textContent += chars[i++];
      setTimeout(type, 55 + Math.random() * 40);
    } else {
      setTimeout(() => { caption.style.borderRight = 'none'; }, 1800);
    }
  };
  setTimeout(type, 600);
}

function initMagneticButtons() {
  document.querySelectorAll('.btn-primary:not(.runaway):not(#promisesNextBtn):not(.no-magnetic)').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

function initPromiseReveal() {
  const items = document.querySelectorAll('.promise-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px)';
    item.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  items.forEach(item => observer.observe(item));
}

function initCardShimmer() {
  document.querySelectorAll('.card').forEach(card => {
    if (card.querySelector('.card-shimmer')) return;
    card.style.overflow = 'hidden';
    Array.from(card.children).forEach(child => {
      if (child.matches('.btn-row') || child.querySelector('.runaway')) return;
      if (!child.classList.contains('card-shimmer')) child.style.position = child.style.position || 'relative';
      if (!child.classList.contains('card-shimmer')) child.style.zIndex = child.style.zIndex || '1';
    });
    const shimmer = document.createElement('div');
    shimmer.className = 'card-shimmer';
    shimmer.style.cssText = `
      position:absolute; inset:0; pointer-events:none; z-index:0;
      background: linear-gradient(105deg, transparent 40%, rgba(168,216,234,0.07) 50%, transparent 60%);
      background-size: 200% 100%;
      animation: border-shimmer 5s linear infinite;
    `;
    card.appendChild(shimmer);
  });
}

function initEnvelopeGlow() {
  const container = document.getElementById('canvas-container-voxel');
  if (!container || container.querySelector('.envelope-glow')) return;

  const glow = document.createElement('div');
  glow.className = 'envelope-glow';
  glow.style.cssText = `
    position: absolute;
    bottom: 30%; left: 50%;
    transform: translateX(-50%);
    width: 200px; height: 60px;
    background: radial-gradient(ellipse, rgba(212,104,138,0.4) 0%, transparent 70%);
    animation: glow-pulse 2s ease-in-out infinite;
    pointer-events: none;
    z-index: 4;
    filter: blur(12px);
  `;
  container.appendChild(glow);
}

// --- Consolidated DOMContentLoaded Event ---
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    runHeartLogic('minecraft-heart-container');
    runHeartLogic('promises-heart-container');
  }

  // Initialize CRT/Y2K effects
  createGlitchEffect();
  addScreenFlicker();
  
  // Lazy load images
  lazyLoadImages();
  
  // Final question click effect
  const finalQuestion = document.querySelector('.final-question');
  if (finalQuestion) {
    finalQuestion.addEventListener('click', function () {
      this.style.transform = 'scale(1.05)';
      setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
    });
  }
  
  // Button styling and effects
  document.querySelectorAll('button, .final-question').forEach(el => {
    el.classList.add('no-select');
    addVHSDistortion(el);
  });
  
  // Initialize particles
  const particlesContainer = document.getElementById('particlesLayer');
  if (particlesContainer && !isLowEndDevice) {
    const pc = isLowEndDevice ? 15 : 30;
    for (let i = 0; i < pc; i++) {
      const el = document.createElement('div');
      el.className = 'particle performance-optimized';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.background = COLOR_PALETTE.particles[Math.floor(Math.random() * COLOR_PALETTE.particles.length)];
      el.style.animationDuration = 10 + Math.random() * 18 + 's';
      el.style.opacity = (0.5 + Math.random() * 0.4).toString();
      el.style.transform = `translateY(${Math.random() * 30}vh)`;
      el.style.borderRadius = '0';
      particlesContainer.appendChild(el);
    }
  }
  
  // Add heart burst to all buttons
  const allButtons = Array.from(document.querySelectorAll('button, .btn'));
  allButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      let x, y;
      if (e.clientX && e.clientY) {
        x = e.clientX;
        y = e.clientY;
      } else {
        const rect = btn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
      if(typeof createHeartBurst === 'function') createHeartBurst(x, y);
    }, { passive: true });
  });

  // New thematic animation layer
  initGhostCursor();
  initTitleGlitch();
  initPageTransition();
  initMagneticButtons();
  initCardShimmer();
  initStarBorder('yesBtn3');
  initPromiseParticles();
  initPromiseReveal();
  initTypewriter();
  initEnvelopeGlow();
});

// --- Three.js Voxel Envelope Engine (Step 5) ---
let voxelScene, voxelCamera, voxelRenderer, envelopeGroup, flapGroup;
let isVoxelOpening = false;
let voxelClock;
let voxelRaycaster, voxelMouse;

function initVoxelStep() {
  if (typeof THREE === 'undefined') return;

  voxelClock = new THREE.Clock();
  const container = document.getElementById('canvas-container-voxel');
  if (!container) return;

  voxelScene = new THREE.Scene();
  voxelCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  updateVoxelCameraPosition();

  voxelRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  voxelRenderer.setSize(container.clientWidth, container.clientHeight);
  voxelRenderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(voxelRenderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  voxelScene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(10, 20, 10);
  voxelScene.add(dirLight);

  createVoxelEnvelope();
  initHeartTunnel();

  voxelRaycaster = new THREE.Raycaster();
  voxelMouse = new THREE.Vector2();

  container.addEventListener('click', onVoxelClick, false);
  container.addEventListener('touchstart', onVoxelTouch, false);
  window.addEventListener('resize', onVoxelResize);

  animateVoxel();
}

function onVoxelTouch(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    onVoxelClick({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
  }
}

function onVoxelClick(event) {
  if (event.preventDefault) event.preventDefault();
  const container = document.getElementById('canvas-container-voxel');
  const rect = container.getBoundingClientRect();
  voxelMouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  voxelMouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  voxelRaycaster.setFromCamera(voxelMouse, voxelCamera);
  const intersects = voxelRaycaster.intersectObjects(voxelScene.children, true);

  if (intersects.length > 0) {
    let clickedObject = intersects[0].object;
    while (clickedObject.parent && clickedObject !== voxelScene) {
      if (clickedObject === envelopeGroup) {
        handleVoxelInteraction();
        return;
      }
      clickedObject = clickedObject.parent;
    }
  }
}

function createVoxelEnvelope() {
  envelopeGroup = new THREE.Group();
  voxelScene.add(envelopeGroup);

  const voxelSize = 1;
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFF8F0, roughness: 0.9 });
  const heartMat = new THREE.MeshStandardMaterial({ color: 0xD4688A, roughness: 0.5 });
  const borderMat = new THREE.LineBasicMaterial({ color: 0xD4688A, linewidth: 2 });

  function addCube(x, y, z, mat, parent) {
    parent = parent || envelopeGroup;
    const geo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, borderMat);
    mesh.add(line);
    parent.add(mesh);
    return mesh;
  }

  for (let x = -6; x < 6; x++) {
    for (let y = -4; y < 4; y++) {
      addCube(x, y, -0.5, whiteMat);
      if (y < 2) addCube(x, y, 0.5, whiteMat);
    }
  }

  flapGroup = new THREE.Group();
  flapGroup.position.set(0, 4, 1);
  envelopeGroup.add(flapGroup);

  for (let x = -6; x < 6; x++) {
    const limit = 6 - Math.abs(x + 0.5);
    for (let y = 0; y < 4; y++) {
      if (y < limit) addCube(x, -y, 0, whiteMat, flapGroup);
    }
  }

  addCube(-0.5, -3, 0.6, heartMat, flapGroup);
  addCube(0.5, -3, 0.6, heartMat, flapGroup);
  addCube(0, -2.5, 0.6, heartMat, flapGroup);
}

function initHeartTunnel() {
  const tunnelContainer = document.getElementById('tunnel-bg');
  if (!tunnelContainer) return;

  const tunnelColors = COLOR_PALETTE.tunnel;
  let tunnelHeartCount = 0;
  const isMobile = window.innerWidth < 768;
  const heartInterval = isMobile ? 500 : 300;

  function createTunnelHeart() {
    const step5 = document.getElementById('step5-new');
    if (step5 && !step5.classList.contains('active')) return;

    const heart = document.createElement('div');
    heart.className = 'bg-heart-tunnel';
    const color = tunnelColors[tunnelHeartCount % tunnelColors.length];
    const encodedColor = encodeURIComponent(color);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 13' shape-rendering='crispEdges'><path fill='${encodedColor}' d='M3 0h3v1h1v1h1V1h1V0h3v1h1v1h1v4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V2h1V1h1V0z'/></svg>`;
    heart.style.backgroundImage = `url("data:image/svg+xml;utf8,${svg}")`;
    heart.style.animation = 'zoomTunnel 10s linear forwards';
    tunnelContainer.appendChild(heart);
    tunnelHeartCount++;
    setTimeout(() => heart.remove(), 10000);
  }

  setInterval(createTunnelHeart, heartInterval);

  const prefillCount = isMobile ? 30 : 60;
  for (let i = 0; i < prefillCount; i++) {
    const heart = document.createElement('div');
    heart.className = 'bg-heart-tunnel';
    const color = tunnelColors[tunnelHeartCount % tunnelColors.length];
    const encodedColor = encodeURIComponent(color);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 13' shape-rendering='crispEdges'><path fill='${encodedColor}' d='M3 0h3v1h1v1h1V1h1V0h3v1h1v1h1v4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V2h1V1h1V0z'/></svg>`;
    heart.style.backgroundImage = `url("data:image/svg+xml;utf8,${svg}")`;
    heart.style.animation = 'zoomTunnel 10s linear forwards';
    heart.style.animationDelay = `-${Math.random() * 10}s`;
    tunnelContainer.appendChild(heart);
    tunnelHeartCount++;
    setTimeout(() => heart.remove(), 10000 + (parseFloat(heart.style.animationDelay) * 1000));
  }
}

function updateVoxelCameraPosition() {
  if (!voxelCamera) return;
  const width = window.innerWidth;
  if (width < 414) voxelCamera.position.z = 50;
  else if (width < 544) voxelCamera.position.z = 48;
  else if (width < 768) voxelCamera.position.z = 52;
  else if (width < 1024) voxelCamera.position.z = 40;
  else voxelCamera.position.z = 30;
  voxelCamera.updateProjectionMatrix();
}

function onVoxelResize() {
  const container = document.getElementById('canvas-container-voxel');
  if (!container || !voxelCamera || !voxelRenderer) return;
  voxelCamera.aspect = container.clientWidth / container.clientHeight;
  voxelCamera.updateProjectionMatrix();
  voxelRenderer.setSize(container.clientWidth, container.clientHeight);
  updateVoxelCameraPosition();
}

function animateVoxel() {
  requestAnimationFrame(animateVoxel);
  const step5 = document.getElementById('step5-new');
  if (step5 && !step5.classList.contains('active')) return;
  if (!voxelClock || !envelopeGroup || !voxelRenderer) return;

  const t = voxelClock.getElapsedTime();
  if (!isVoxelOpening) {
    envelopeGroup.rotation.y = Math.sin(t * 0.5) * 0.2;
    envelopeGroup.rotation.x = Math.cos(t * 0.3) * 0.1;
    envelopeGroup.position.y = Math.sin(t * 1.5) * 0.5;
  }
  voxelRenderer.render(voxelScene, voxelCamera);
}

function handleVoxelInteraction() {
  if (isVoxelOpening) return;
  if (typeof gsap === 'undefined') return;

  isVoxelOpening = true;
  const hint = document.getElementById('hint-voxel');
  if (hint) hint.style.display = 'none';

  const tl = gsap.timeline();
  tl.to(envelopeGroup.rotation, { x: 0, y: 0, z: 0, duration: 0.5 })
    .to(envelopeGroup.position, { y: -5, duration: 0.5 }, 0);
  tl.to(flapGroup.rotation, { x: Math.PI * 0.8, duration: 1.2, ease: "power2.inOut" }, 0.5);
  tl.to(document.getElementById('letter-voxel'), { visibility: 'visible', scale: 1, opacity: 1, duration: 1, ease: "back.out(1.4)" }, 1.2);
  tl.to(envelopeGroup.position, { y: -30, opacity: 0, duration: 1.5 }, 1.5);
}

function closeVoxelLetter() {
  if (typeof gsap === 'undefined') return;

  isVoxelOpening = false;
  gsap.to(document.getElementById('letter-voxel'), {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      const letter = document.getElementById('letter-voxel');
      if (letter) letter.style.visibility = 'hidden';
      const hint = document.getElementById('hint-voxel');
      if (hint) hint.style.display = 'block';
      if (flapGroup) flapGroup.rotation.x = 0;
      if (envelopeGroup) envelopeGroup.position.y = -5;
    }
  });
  gsap.to(envelopeGroup.position, { y: 0, duration: 1 });
}
