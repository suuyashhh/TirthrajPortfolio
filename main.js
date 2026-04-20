import * as THREE from 'three';

// --- Three.js Background Implementation ---
function initThree() {
    const canvas = document.querySelector('#bg-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Particles
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
        colors[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating Sphere with Wireframe
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Resize Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Interactive movement
        particles.position.x += (mouseX * 0.5 - particles.position.x) * 0.05;
        particles.position.y += (mouseY * 0.5 - particles.position.y) * 0.05;

        sphere.rotation.y += 0.002;
        sphere.rotation.z += 0.001;

        renderer.render(scene, camera);
    }
    animate();
}

// --- Scroll Reveal Logic ---
function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .glass-card, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// --- Loader Logic ---
window.addEventListener('load', () => {
    const loader = document.querySelector('#loader');
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Add revealed class to hero elements immediately
        document.querySelectorAll('.hero .reveal, .hero .reveal-delay-1, .hero .reveal-delay-2, .hero .reveal-delay-3').forEach(el => {
            el.classList.add('revealed');
        });
    }, 1000);
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    initReveal();
    
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
});

// Form Submission UI Feedback
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Message Sent!';
    btn.style.background = 'linear-gradient(45deg, #00ff88, #00d2ff)';
    e.target.reset();
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = 'var(--neon-gradient)';
    }, 3000);
});
