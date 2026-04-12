/**
 * Neural Flow Field - Organic & Professional 3D Scene
 * Built for Bruno Fernandes | AI Specialist Portfolio
 */

const initNeuralFlow = () => {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Settings
    const particleCount = 250; // Optimized for performance with connections
    const maxDistance = 0.5;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    // Initial distribution in a wide 3D space
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Radial Glow Texture for Particles
    const createCircleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    };

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.035, // Slightly smaller
        color: '#b08d57', 
        transparent: true,
        opacity: 0.8,
        map: createCircleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Lines / Connections (Neural Web)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: '#b08d57',
        transparent: true,
        opacity: 0.1
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    camera.position.z = 2.5;

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    // Theme Detection and Update
    const updateThemeColors = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Update Particles
        particlesMaterial.color.set(isLight ? '#8b6b3f' : '#b08d57');
        particlesMaterial.opacity = isLight ? 0.4 : 0.8;
        particlesMaterial.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
        
        // Update Lines
        lineMaterial.color.set(isLight ? '#8b6b3f' : '#b08d57');
        lineMaterial.opacity = isLight ? 0.15 : 0.1;
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateThemeColors();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Initial call
    updateThemeColors();

    const animate = () => {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.0005;
        const pos = particlesGeometry.attributes.position.array;
        
        // Update particles with "Flow Field" logic
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Organic swimmers
            pos[i3] += Math.sin(time + pos[i3+1] * 2) * 0.002 + velocities[i3] * 0.2;
            pos[i3+1] += Math.cos(time + pos[i3] * 2) * 0.002 + velocities[i3+1] * 0.2;
            pos[i3+2] += Math.sin(time * 0.8 + pos[i3] * 1.5) * 0.002 + velocities[i3+2] * 0.2;

            // Boundary wrapping
            if (pos[i3] > 3) pos[i3] = -3;
            if (pos[i3] < -3) pos[i3] = 3;
            if (pos[i3+1] > 3) pos[i3+1] = -3;
            if (pos[i3+1] < -3) pos[i3+1] = 3;
            if (pos[i3+2] > 3) pos[i3+2] = -3;
            if (pos[i3+2] < -3) pos[i3+2] = 3;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Neural Connections (Dynamic Plexus)
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < maxDistance * maxDistance) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                }
            }
        }
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

        // Parallax Camera Movement
        targetCameraX += (mouseX * 0.5 - targetCameraX) * 0.05;
        targetCameraY += (mouseY * 0.5 - targetCameraY) * 0.05;
        camera.position.x = targetCameraX;
        camera.position.y = -targetCameraY;
        camera.lookAt(0, 0, 0);

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNeuralFlow);
} else {
    initNeuralFlow();
}
