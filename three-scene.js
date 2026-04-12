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

    // Create a circular sprite for particles
    const createCircleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    };

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: '#b08d57', // var(--accent-primary)
        transparent: true,
        opacity: 0.8,
        map: createCircleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
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

        const time = Date.now() * 0.001;
        
        // "Vida própria": Rotação sutil e profundidade dinâmica
        particlesMesh.rotation.y += 0.001 * 0.5;
        particlesMesh.rotation.x += 0.0005 * 0.5;
        
        // Pulsação de escala para profundidade extra
        const pulse = 1 + Math.sin(time * 0.5) * 0.05;
        particlesMesh.scale.set(pulse, pulse, pulse);

        // Movimento de "Onda" nos pontos individuais para profundidade real
        const positions = particlesGeometry.attributes.position.array;
        for(let i = 0; i < particlesCount; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            
            // Cria uma oscilação baseada na posição X e Y
            positions[i * 3 + 2] = Math.sin(time + x * 2 + y * 2) * 0.15;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Suavização do seguimento do mouse
        const targetX = mouseX * 0.2;
        const targetY = -mouseY * 0.2; // Inverted for more natural feel
        
        particlesMesh.rotation.x += 0.03 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.y += 0.03 * (targetX - particlesMesh.rotation.y);

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
