import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Eye, RefreshCw, Maximize2, Zap, Layers, Activity } from 'lucide-react';

interface CyberShield3DProps {
  threatLevel?: 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';
  activeNodesCount?: number;
  className?: string;
}

export const CyberShield3D: React.FC<CyberShield3DProps> = ({
  threatLevel = 'LOW',
  activeNodesCount = 42,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({ fps: 60, particles: 180, orbitalNodes: 16 });

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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b12, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Cyber Shield 3-Part Group Model
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Color theme based on threat level
    let primaryColor = 0x00f0ff; // Cyan
    let secondaryColor = 0x00ff88; // Emerald
    if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
      primaryColor = 0xff3366; // Crimson
      secondaryColor = 0xffaa00; // Amber
    } else if (threatLevel === 'SUSPICIOUS') {
      primaryColor = 0xffaa00;
      secondaryColor = 0x00f0ff;
    }

    // Part 1: Central Geometric Core (Icosahedron Shield)
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Part 2: Inner Hologram Sphere
    const innerGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0a2238,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // Part 3: Orbital Tactical Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.02, 8, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.8
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    rootGroup.add(ring1Mesh);

    // Part 4: Orbital Tactical Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.015, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    rootGroup.add(ring2Mesh);

    // Part 5: Floating Satellites / Threat Node Indicators
    const nodeCount = 24;
    const nodeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const dummy = new THREE.Object3D();
    const nodePositions: { radius: number; speed: number; angle: number; y: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 2.4 + Math.random() * 1.2;
      const angle = (i / nodeCount) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.8;
      const speed = (0.3 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1);
      nodePositions.push({ radius, speed, angle, y });

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    rootGroup.add(instancedNodes);

    // Part 6: Ambient Background Particles
    const particleCount = isSoftwareGl ? 80 : 180;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.4
    });
    const particleField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleField);

    // 3. Pointer & Damping Physics
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.4;
      targetRotationX = y * 0.3;
    };

    container.addEventListener('pointermove', onPointerMove);

    // 4. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 340;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // 5. Render Loop with Exponential Damping
    let animId = 0;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Exponential damping on user tilt
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 4, delta);
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 4, delta);

      rootGroup.rotation.x = currentRotationX;
      rootGroup.rotation.y = currentRotationY;

      // Autonomous rotation
      if (isRotating) {
        coreMesh.rotation.y += 0.006;
        coreMesh.rotation.x += 0.003;
        innerMesh.rotation.y -= 0.004;
        ring1Mesh.rotation.z += 0.008;
        ring2Mesh.rotation.z -= 0.006;
      }

      // Update orbiting satellites
      for (let i = 0; i < nodeCount; i++) {
        const np = nodePositions[i];
        const curAngle = np.angle + time * np.speed * 0.4;
        dummy.position.set(
          Math.cos(curAngle) * np.radius,
          np.y + Math.sin(time * 2 + i) * 0.15,
          Math.sin(curAngle) * np.radius
        );
        dummy.rotation.x += 0.02;
        dummy.rotation.y += 0.03;
        dummy.updateMatrix();
        instancedNodes.setMatrixAt(i, dummy.matrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;

      // Drift particle field
      particleField.rotation.y = time * 0.015;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
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
    <div className={`relative w-full h-full min-h-[360px] rounded-xl overflow-hidden bg-gradient-to-b from-[#080b12] to-[#04060a] border border-[#1b2438] flex flex-col ${className}`}>
      {/* Tactical HUD Header */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
            [+] 3D CYBERNETIC SHIELD & SPATIAL RADAR
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>NODES: <strong className="text-slate-200">{activeNodesCount}</strong></span>
          <span className="hidden sm:inline">DEFENSE: <strong className="text-emerald-400">NOMINAL</strong></span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            THREE.JS r182
          </span>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="w-full flex-1 relative cursor-grab active:cursor-grabbing" />

      {/* Ergonomic Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg">
        <div className="p-2 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between gap-2 shadow-2xl text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                isRotating 
                  ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>{isRotating ? 'ROTATING' : 'PAUSED'}</span>
            </button>

            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>RADAR MESH</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <span className="hidden sm:inline text-slate-500">SSRF PERIMETER:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> ARMED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
