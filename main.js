import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 0;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// --- Lighting ---
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional light for highlights
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// --- Object: Gold Ring (Torus) ---
// Geometry
const geometry = new THREE.TorusGeometry(1.8, 0.4, 64, 100);

// Material: Physical material for realistic metal
const material = new THREE.MeshPhysicalMaterial({
    color: 0xD4AF37,       // Gold color
    metalness: 1.0,        // Fully metallic
    roughness: 0.15,       // Slightly polished, not perfect mirror
    clearcoat: 1.0,        // Shiny coating
    clearcoatRoughness: 0.1,
});

const ring = new THREE.Mesh(geometry, material);
scene.add(ring);

// Move ring to the right side for composition (desktop)
if (window.innerWidth > 768) {
    ring.position.x = 2;
}

// --- Environment Map (Crucial for reflections) ---
// Using a generated PMREM or just a simple cube map logic? 
// For simplicity in this static setup without external HDRI files, we will use a CubeTexture or just generic reflections.
// However, PhysicalMaterial needs an environment to look good.
// We'll create a simple environment scene for reflections using a CubeCamera or simply load a preset if we had one.
// Since we can't easily fetch an HDRI from the web without CORS in some setups, we will rely on scene lights, 
// but to make it pop, let's add some point lights around it.

const pointLight1 = new THREE.PointLight(0xffaa00, 5, 10);
pointLight1.position.set(-2, 2, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 5, 10);
pointLight2.position.set(2, -2, 2);
scene.add(pointLight2);


// --- Animation Loop ---
let scrollY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Continuous generic rotation
    ring.rotation.x += 0.002;
    ring.rotation.y += 0.003;

    // Scroll based rotation
    ring.rotation.z = scrollY * 0.001;
    ring.position.y = scrollY * 0.002; // Parallax effect

    renderer.render(scene, camera);
}

animate();

// --- Event Listeners ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Responsive positioning
    if (window.innerWidth > 768) {
        ring.position.x = 2;
    } else {
        ring.position.x = 0;
        ring.position.y = 1; 
    }
});

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});
