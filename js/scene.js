/**
 * LIQUID CHROME - 3D INFLATED SCULPTURE ENGINE (Three.js)
 * Portfolio of Ayush Pratap Singh
 * 
 * Features:
 * - Inflated soft-bodied chrome object with MeshPhysicalMaterial
 * - Procedural studio environment map with Laser Crimson rim reflections
 * - Continuous organic liquid vertex displacement (wave/noise math)
 * - Mouse tilt responsiveness + dynamic liquid ripple on pointer movement
 * - Capped pixelRatio, offscreen pause via IntersectionObserver & visibilitychange
 * - Reduced motion compliance
 */

export function initChromeScene() {
  const container = document.getElementById('canvas-container');
  const fallback = document.querySelector('.canvas-fallback');

  if (!container || typeof THREE === 'undefined') {
    if (fallback) fallback.style.display = 'block';
    return;
  }

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    if (fallback) fallback.style.display = 'block';
    return;
  }

  // Device & Screen constraints
  const isMobile = window.innerWidth < 768;
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 450;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  // WebGL Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.warn('WebGL init failed, displaying fallback:', err);
    if (fallback) fallback.style.display = 'block';
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // --------------------------------------------------------------------------
  // Studio HDR Environment Map Generator
  // Creates a clean metallic studio reflection texture without external files
  // --------------------------------------------------------------------------
  function createStudioEnvMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Obsidian base
    ctx.fillStyle = '#0A0A0C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Primary White Softbox Strip (top)
    const gradTop = ctx.createLinearGradient(0, 0, 0, 180);
    gradTop.addColorStop(0, '#FFFFFF');
    gradTop.addColorStop(0.5, '#C9CDD3');
    gradTop.addColorStop(1, '#0A0A0C');
    ctx.fillStyle = gradTop;
    ctx.fillRect(100, 20, 824, 140);

    // Lateral Chrome Highlights
    const gradLeft = ctx.createRadialGradient(220, 260, 10, 220, 260, 220);
    gradLeft.addColorStop(0, '#FFFFFF');
    gradLeft.addColorStop(0.35, '#A0A6B2');
    gradLeft.addColorStop(1, 'transparent');
    ctx.fillStyle = gradLeft;
    ctx.fillRect(0, 100, 450, 320);

    // Sharp Laser Crimson Reflection Rim (bottom right)
    const gradCrimson = ctx.createRadialGradient(850, 380, 10, 850, 380, 260);
    gradCrimson.addColorStop(0, '#FF1A3C');
    gradCrimson.addColorStop(0.4, 'rgba(255, 26, 60, 0.45)');
    gradCrimson.addColorStop(1, 'transparent');
    ctx.fillStyle = gradCrimson;
    ctx.fillRect(600, 200, 424, 312);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  const envTexture = createStudioEnvMap();
  scene.environment = envTexture;

  // --------------------------------------------------------------------------
  // Inflated Liquid-Chrome Material
  // MeshPhysicalMaterial with metalness 1, high clearcoat, and reflection
  // --------------------------------------------------------------------------
  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xC9CDD3,
    metalness: 1.0,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
    envMap: envTexture,
    envMapIntensity: 2.2
  });

  // --------------------------------------------------------------------------
  // Geometry: Puffy, Soft-Bodied Inflated Form
  // Detailed Torus Knot with thick balloon tubing
  // --------------------------------------------------------------------------
  const tubularSegments = isMobile ? 64 : 110;
  const radialSegments = isMobile ? 32 : 56;
  
  // Radius 1.6, puffy tube radius 0.72
  const geometry = new THREE.TorusKnotGeometry(1.5, 0.68, tubularSegments, radialSegments, 2, 3);
  
  // Store original vertex coordinates and normals for wave displacement
  const positionAttribute = geometry.attributes.position;
  const originalPositions = positionAttribute.clone();
  const normalAttribute = geometry.attributes.normal;
  const vertexCount = positionAttribute.count;

  const chromeMesh = new THREE.Mesh(geometry, chromeMaterial);
  scene.add(chromeMesh);

  // --------------------------------------------------------------------------
  // Lighting Setup: Studio Key + Laser Crimson Rim Light
  // --------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x121216, 1.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xF2F4F7, 2.5);
  mainLight.position.set(4, 6, 5);
  scene.add(mainLight);

  // Laser Crimson Rim Light (creates intense crimson specular edge)
  const crimsonRimLight = new THREE.PointLight(0xFF1A3C, 6.0, 15);
  crimsonRimLight.position.set(-3.8, -2.5, -2.5);
  scene.add(crimsonRimLight);

  const crimsonFrontLight = new THREE.PointLight(0xFF1A3C, 1.8, 10);
  crimsonFrontLight.position.set(3, -2, 2.5);
  scene.add(crimsonFrontLight);

  // --------------------------------------------------------------------------
  // Interactive Dynamics: Mouse Tilt & Ripple
  // --------------------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let rippleIntensity = 0;

  function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;

      targetRotationY = mouseX * 0.75;
      targetRotationX = -mouseY * 0.75;

      // Excite surface ripple on movement
      rippleIntensity = Math.min(rippleIntensity + 0.04, 0.28);
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // --------------------------------------------------------------------------
  // Animation Loop & Performance Management
  // --------------------------------------------------------------------------
  let animationFrameId = null;
  let isRunning = true;
  let clock = new THREE.Clock();

  function animate() {
    if (!isRunning) return;

    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia tilt
    chromeMesh.rotation.y += (targetRotationY - chromeMesh.rotation.y) * 0.05 + 0.003;
    chromeMesh.rotation.x += (targetRotationX - chromeMesh.rotation.x) * 0.05 + 0.0015;
    chromeMesh.rotation.z += 0.002;

    // Decay ripple intensity
    rippleIntensity *= 0.94;
    const baseAmplitude = 0.045 + rippleIntensity;

    // Fluid vertex wave displacement
    const pos = positionAttribute.array;
    const orig = originalPositions.array;
    const norm = normalAttribute.array;

    for (let i = 0; i < vertexCount; i++) {
      const idx = i * 3;
      const ox = orig[idx];
      const oy = orig[idx + 1];
      const oz = orig[idx + 2];

      const nx = norm[idx];
      const ny = norm[idx + 1];
      const nz = norm[idx + 2];

      // Multi-frequency wave calculation simulating molten surface tension
      const wave = Math.sin(ox * 2.2 + elapsedTime * 2.0) *
                   Math.cos(oy * 2.5 + elapsedTime * 1.8) *
                   Math.sin(oz * 2.0 + elapsedTime * 1.5);

      const displacement = wave * baseAmplitude;

      pos[idx] = ox + nx * displacement;
      pos[idx + 1] = oy + ny * displacement;
      pos[idx + 2] = oz + nz * displacement;
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    renderer.render(scene, camera);
  }

  // --------------------------------------------------------------------------
  // Lifecycle & Performance: IntersectionObserver & Tab Visibility
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');

  function startAnimation() {
    if (!isRunning) {
      isRunning = true;
      clock.start();
      animate();
    }
  }

  function stopAnimation() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  } else {
    startAnimation();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // --------------------------------------------------------------------------
  // Responsive Resize Handling
  // --------------------------------------------------------------------------
  function handleResize() {
    if (!container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    if (newWidth > 0 && newHeight > 0) {
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
  }

  window.addEventListener('resize', handleResize, { passive: true });
}
