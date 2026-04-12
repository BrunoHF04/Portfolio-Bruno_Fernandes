/**
 * Three.js Scene - Interactive Particle Sphere for Portfolio Hero
 * By Bruno Fernandes Assistant
 */

const initThreeScene = () => {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#b08d57', // var(--accent-primary)
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        
        // Gentle float based on mouse
        const targetX = mouseX * 0.5;
        const targetY = mouseY * 0.5;
        
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);

        renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
};

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}
