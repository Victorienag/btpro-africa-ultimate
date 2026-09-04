import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useProject } from '../../context/ProjectContext';
import { Box, RotateCw, Sun, Eye, Layers } from 'lucide-react';

export default function Viewer3D() {
  const { activeProject } = useProject();
  const mountRef = useRef(null);
  
  const [wireframe, setWireframe] = useState(false);
  const [wallColor, setWallColor] = useState('#f8fafc'); // Default white tropical
  const [isRotating, setIsRotating] = useState(true);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshGroupRef = useRef(null);

  const L = Number(activeProject?.length) || 20;
  const W = Number(activeProject?.width) || 15;

  const colorOptions = [
    { name: 'Blanc Tropical', color: '#f8fafc' },
    { name: 'Ocre Sahara', color: '#f59e0b' },
    { name: 'Gris Béton BTP', color: '#94a3b8' },
    { name: 'Terracotta Ivoire', color: '#ea580c' },
    { name: 'Bleu Sérénité', color: '#38bdf8' }
  ];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    sceneRef.current = scene;

    const width = mount.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(25, 20, 30);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.2);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(50, 50, 0xf97316, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Group for building meshes
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // 1. Terrain Ground
    const groundGeo = new THREE.BoxGeometry(L * 0.8 + 8, 0.2, W * 0.8 + 8);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    group.add(ground);

    // 2. Main Building Body
    const bW = Math.min(L * 0.6, 12);
    const bD = Math.min(W * 0.6, 9);
    const bH = 3.5;

    const wallGeo = new THREE.BoxGeometry(bW, bH, bD);
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(wallColor), 
      roughness: 0.4,
      wireframe: wireframe
    });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.set(0, bH / 2, 0);
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);

    // 3. Pitched Roof (Pyramid / Prism)
    const roofGeo = new THREE.ConeGeometry(Math.max(bW, bD) * 0.75, 2.2, 4);
    const roofMat = new THREE.MeshStandardMaterial({ 
      color: 0x9a3412, 
      roughness: 0.6,
      wireframe: wireframe 
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, bH + 1.1, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 4. Main Entrance Door
    const doorGeo = new THREE.BoxGeometry(1.2, 2.3, 0.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.15, bD / 2 + 0.05);
    group.add(door);

    // 5. Windows
    const winGeo = new THREE.BoxGeometry(1.8, 1.3, 0.15);
    const winMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8 });
    
    const win1 = new THREE.Mesh(winGeo, winMat);
    win1.position.set(-bW / 4, 2.0, bD / 2 + 0.05);
    group.add(win1);

    const win2 = new THREE.Mesh(winGeo, winMat);
    win2.position.set(bW / 4, 2.0, bD / 2 + 0.05);
    group.add(win2);

    // 6. Swimming Pool
    const poolGeo = new THREE.BoxGeometry(4.5, 0.1, 3.0);
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.3 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(bW / 2 + 3.5, 0.05, 0);
    group.add(pool);

    // Mouse Drag Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(5, Math.min(40, camera.position.y + deltaY * 0.05));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        group.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mount && renderer.domElement) {
        mount.innerHTML = '';
      }
    };
  }, [L, W, wallColor, wireframe, isRotating]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* 3D Toolbar */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300">Couleur Façade :</span>
          <div className="flex items-center gap-1.5">
            {colorOptions.map(c => (
              <button
                key={c.color}
                onClick={() => setWallColor(c.color)}
                style={{ backgroundColor: c.color }}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  wallColor === c.color ? 'scale-125 border-orange-500 shadow-md' : 'border-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              wireframe ? 'bg-orange-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Filaire / Structure</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isRotating ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isRotating ? 'Auto-Rotation ON' : 'Rotation Libre'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Area */}
      <div ref={mountRef} className="w-full h-[500px] cursor-grab active:cursor-grabbing bg-slate-950" />

      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Contrôles : Cliquez et glissez pour orbiter | Rendu Three.js temps réel 60 FPS</span>
        <span className="text-orange-400 font-mono font-bold">Modèle 3D Basse-Poly Optimisé</span>
      </div>
    </div>
  );
}
