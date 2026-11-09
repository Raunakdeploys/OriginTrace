import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';

export const CyberShield3D = ({
  threatLevel = 'LOW',
  activeNodesCount = 42,
  className = ''
}) => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to safeguard performance
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Color theme based on threat level
    let primaryColor = 0x38bdf8; // Sky / Cyan
    let secondaryColor = 0x34d399; // Emerald
    if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
      primaryColor = 0xf43f5e;
      secondaryColor = 0xfbbf24;
    } else if (threatLevel === 'SUSPICIOUS') {
      primaryColor = 0xfbbf24;
      secondaryColor = 0x38bdf8;
    }

    // Part 1: Central Geometric Core (Icosahedron Shield)
    const coreGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Part 2: Inner Core Sphere
    const innerGeo = new THREE.SphereGeometry(1.5, 14, 14);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // Part 3: Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.6, 0.015, 8, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.7
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    rootGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(3.0, 0.012, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.45
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    rootGroup.add(ring2Mesh);

    // Part 4: Floating Satellites / Nodes
    const nodeCount = 18;
    const nodeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const dummy = new THREE.Object3D();
    const nodePositions = [];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 2.4 + Math.random() * 1.0;
      const angle = (i / nodeCount) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.4;
      const speed = (0.25 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      nodePositions.push({ radius, speed, angle, y });

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    rootGroup.add(instancedNodes);

    // Ambient Particles
    const particleCount = isSoftwareGl ? 50 : 120;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.03,
      transparent: true,
      opacity: 0.35
    });
    const particleField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleField);

    // Pointer tilt damping
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.35;
      targetRotationX = y * 0.25;
    };

    container.addEventListener('pointermove', onPointerMove);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 4, delta);
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 4, delta);

      rootGroup.rotation.x = currentRotationX;
      rootGroup.rotation.y = currentRotationY;

      if (isRotating) {
        coreMesh.rotation.y += 0.005;
        coreMesh.rotation.x += 0.002;
        innerMesh.rotation.y -= 0.003;
        ring1Mesh.rotation.z += 0.006;
        ring2Mesh.rotation.z -= 0.005;
      }

      for (let i = 0; i < nodeCount; i++) {
        const np = nodePositions[i];
        const curAngle = np.angle + time * np.speed * 0.35;
        dummy.position.set(
          Math.cos(curAngle) * np.radius,
          np.y + Math.sin(time * 2 + i) * 0.12,
          Math.sin(curAngle) * np.radius
        );
        dummy.rotation.x += 0.01;
        dummy.rotation.y += 0.02;
        dummy.updateMatrix();
        instancedNodes.setMatrixAt(i, dummy.matrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;
      particleField.rotation.y = time * 0.01;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, [threatLevel, isRotating]);

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden glass-panel flex flex-col ${className}`}>
      {/* Header Tag */}
      <div className="absolute top-4 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          <span className="text-xs font-mono font-medium tracking-wide text-slate-300">
            3D Spatial Security Matrix
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            {threatLevel} RISK
          </span>
        </div>
      </div>

      {/* WebGL Canvas */}
      <div ref={mountRef} className="w-full flex-1 relative cursor-grab active:cursor-grabbing" />

      {/* Minimalist Floating Glass Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <div className="px-3 py-1.5 rounded-full glass-panel flex items-center gap-3 text-xs font-mono shadow-lg">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isRotating ? 'Active' : 'Paused'}</span>
          </button>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeNodesCount} Nodes Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
