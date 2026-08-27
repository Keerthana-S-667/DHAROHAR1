import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Hotspot } from '../../types';
import { heritageService } from '../../services/heritageService';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  Sunset, 
  Layers, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Camera, 
  Volume2, 
  VolumeX, 
  Info,
  X,
  Compass,
  Eye
} from 'lucide-react';

interface ShoreTempleViewerProps {
  onSelectHotspot?: (hotspot: Hotspot) => void;
  activeHotspotId?: string | null;
}

export const ShoreTempleViewer: React.FC<ShoreTempleViewerProps> = ({
  onSelectHotspot,
  activeHotspotId
}) => {
  const hotspots = heritageService.getShoreTempleHotspots();
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [lightingMode, setLightingMode] = useState<'dawn' | 'golden' | 'night' | 'wireframe'>('golden');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const [cameraZoomLevel, setCameraZoomLevel] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);

  // Audio synthesizer ref for ambient temple & sea sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const templeGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{ stone: THREE.MeshStandardMaterial; darkBasalt: THREE.MeshStandardMaterial; gold: THREE.MeshStandardMaterial; wire: THREE.MeshBasicMaterial } | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Camera Orbit State
  const orbitState = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0.35, y: 0.75 },
    targetRotation: { x: 0.35, y: 0.75 },
    distance: 22,
    targetDistance: 22,
    targetLookAt: new THREE.Vector3(0, 3, 0),
    currentLookAt: new THREE.Vector3(0, 3, 0)
  });

  // Sound generator toggle
  const toggleAmbientSound = () => {
    if (!ambientSound) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Ocean wave simulation (filtered pink/white noise buffer)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        oceanGainRef.current = gain;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();

        // Play subtle sacred temple chime bell
        playTempleChime(ctx);

        setAmbientSound(true);
      } catch (err) {
        console.error('Audio ambient start failed', err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSound(false);
    }
  };

  const playTempleChime = (ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio sacred frequency
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 3.5);
  };

  useEffect(() => {
    if (activeHotspotId) {
      const hotspots = heritageService.getShoreTempleHotspots();
      const found = hotspots.find(h => h.id === activeHotspotId);
      if (found) {
        handleSelectHotspot(found);
      }
    }
  }, [activeHotspotId]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x17130F);
    scene.fog = new THREE.FogExp2(0x17130F, 0.025);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Groups
    const templeGroup = new THREE.Group();
    scene.add(templeGroup);
    templeGroupRef.current = templeGroup;

    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Procedural Materials
    // Granite sandstone texture generation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#947854';
    ctx.fillRect(0, 0, 512, 512);
    // Add stone flecks
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(Math.random() * 70);
      ctx.fillStyle = `rgba(${120 + gray}, ${100 + gray}, ${70 + gray}, ${0.1 + Math.random() * 0.3})`;
      ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
    const stoneTexture = new THREE.CanvasTexture(canvas);
    stoneTexture.wrapS = THREE.RepeatWrapping;
    stoneTexture.wrapT = THREE.RepeatWrapping;
    stoneTexture.repeat.set(4, 4);

    const stoneMaterial = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.85,
      metalness: 0.12,
      color: new THREE.Color(0xb89a72)
    });

    const darkBasaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1d1b,
      roughness: 0.4,
      metalness: 0.3
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a85a,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x5a3e10,
      emissiveIntensity: 0.2
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4a85a,
      wireframe: true
    });

    materialsRef.current = {
      stone: stoneMaterial,
      darkBasalt: darkBasaltMaterial,
      gold: goldMaterial,
      wire: wireMaterial
    };

    // ==========================================
    // BUILD SHORE TEMPLE 3D ARCHITECTURAL MODEL
    // ==========================================

    // 1. BASE PLINTH & GROUND (Adhishthana)
    const baseGeo = new THREE.BoxGeometry(14, 0.8, 18);
    const baseMesh = new THREE.Mesh(baseGeo, stoneMaterial);
    baseMesh.position.y = 0.4;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    templeGroup.add(baseMesh);

    // Stepped surrounding courtyard
    const courtyardGeo = new THREE.BoxGeometry(22, 0.3, 26);
    const courtyardMesh = new THREE.Mesh(courtyardGeo, stoneMaterial);
    courtyardMesh.position.y = 0.15;
    courtyardMesh.receiveShadow = true;
    templeGroup.add(courtyardMesh);

    // Ocean beach sand surrounding
    const sandGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0x3d3023,
      roughness: 0.95,
      metalness: 0.05
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.rotation.x = -Math.PI / 2;
    sandMesh.position.y = 0;
    sandMesh.receiveShadow = true;
    templeGroup.add(sandMesh);

    // Ancient sea breakwater granite boulders (East side)
    for (let i = 0; i < 18; i++) {
      const radius = 0.7 + Math.random() * 0.8;
      const rockGeo = new THREE.DodecahedronGeometry(radius, 1);
      const rockMesh = new THREE.Mesh(rockGeo, stoneMaterial);
      const angle = (i / 18) * Math.PI * 0.9 - Math.PI * 0.45;
      rockMesh.position.set(-6 - Math.cos(angle) * 5, radius * 0.6, Math.sin(angle) * 11);
      rockMesh.rotation.set(Math.random(), Math.random(), Math.random());
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      templeGroup.add(rockMesh);
    }

    // 2. MAIN EAST VIMANA TOWER (Dravidian Stepped Pyramid)
    const mainVimanaGroup = new THREE.Group();
    mainVimanaGroup.position.set(0, 0.8, 2);

    // Sanctum Cella (Garbhagriha walls)
    const cellaGeo = new THREE.BoxGeometry(5.5, 2.4, 5.5);
    const cellaMesh = new THREE.Mesh(cellaGeo, stoneMaterial);
    cellaMesh.position.y = 1.2;
    cellaMesh.castShadow = true;
    cellaMesh.receiveShadow = true;
    mainVimanaGroup.add(cellaMesh);

    // Inner sanctum Shiva Lingam
    const lingamBaseGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.4, 16);
    const lingamBase = new THREE.Mesh(lingamBaseGeo, darkBasaltMaterial);
    lingamBase.position.set(0, 0.4, 0);
    mainVimanaGroup.add(lingamBase);

    const lingamGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16);
    const lingamMesh = new THREE.Mesh(lingamGeo, darkBasaltMaterial);
    lingamMesh.position.set(0, 0.9, 0);
    mainVimanaGroup.add(lingamMesh);

    // Tiered Stepped Pyramidal Storeys (Talas)
    const tiers = [
      { w: 4.8, h: 0.9, y: 2.85 },
      { w: 4.0, h: 0.8, y: 3.7 },
      { w: 3.2, h: 0.7, y: 4.45 },
      { w: 2.4, h: 0.6, y: 5.1 },
      { w: 1.8, h: 0.5, y: 5.65 }
    ];

    tiers.forEach((tier) => {
      const tierGeo = new THREE.BoxGeometry(tier.w, tier.h, tier.w);
      const tierMesh = new THREE.Mesh(tierGeo, stoneMaterial);
      tierMesh.position.y = tier.y;
      tierMesh.castShadow = true;
      tierMesh.receiveShadow = true;
      mainVimanaGroup.add(tierMesh);

      // Cornice eaves (Kapota)
      const eaveGeo = new THREE.BoxGeometry(tier.w + 0.3, 0.15, tier.w + 0.3);
      const eaveMesh = new THREE.Mesh(eaveGeo, stoneMaterial);
      eaveMesh.position.y = tier.y + tier.h / 2;
      mainVimanaGroup.add(eaveMesh);

      // Miniature Kuta pavilion shrines on tier corners
      const kutaSize = 0.35;
      const offsets = [
        [-tier.w / 2 + 0.2, tier.w / 2 - 0.2],
        [tier.w / 2 - 0.2, tier.w / 2 - 0.2],
        [-tier.w / 2 + 0.2, -tier.w / 2 + 0.2],
        [tier.w / 2 - 0.2, -tier.w / 2 + 0.2]
      ];
      offsets.forEach(([ox, oz]) => {
        const kutaGeo = new THREE.BoxGeometry(kutaSize, 0.4, kutaSize);
        const kutaMesh = new THREE.Mesh(kutaGeo, stoneMaterial);
        kutaMesh.position.set(ox, tier.y + tier.h / 2 + 0.2, oz);
        mainVimanaGroup.add(kutaMesh);
      });
    });

    // Octagonal Shikhara Dome & Kalasha finial
    const shikharaGeo = new THREE.CylinderGeometry(0.7, 1.2, 0.8, 8);
    const shikharaMesh = new THREE.Mesh(shikharaGeo, stoneMaterial);
    shikharaMesh.position.y = 6.3;
    shikharaMesh.castShadow = true;
    mainVimanaGroup.add(shikharaMesh);

    const stupiGeo = new THREE.ConeGeometry(0.35, 0.7, 12);
    const stupiMesh = new THREE.Mesh(stupiGeo, goldMaterial);
    stupiMesh.position.y = 7.05;
    stupiMesh.castShadow = true;
    mainVimanaGroup.add(stupiMesh);

    templeGroup.add(mainVimanaGroup);

    // 3. SECONDARY WEST SHIVA VIMANA (Smaller Tower)
    const westVimanaGroup = new THREE.Group();
    westVimanaGroup.position.set(0, 0.8, -4.5);

    const westCellaGeo = new THREE.BoxGeometry(3.8, 1.8, 3.8);
    const westCellaMesh = new THREE.Mesh(westCellaGeo, stoneMaterial);
    westCellaMesh.position.y = 0.9;
    westCellaMesh.castShadow = true;
    westVimanaGroup.add(westCellaMesh);

    const westTiers = [
      { w: 3.2, h: 0.6, y: 2.1 },
      { w: 2.4, h: 0.5, y: 2.65 },
      { w: 1.6, h: 0.4, y: 3.1 }
    ];
    westTiers.forEach((tier) => {
      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.w, tier.h, tier.w), stoneMaterial);
      tierMesh.position.y = tier.y;
      tierMesh.castShadow = true;
      westVimanaGroup.add(tierMesh);
    });

    const westShikhara = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 0.6, 8), stoneMaterial);
    westShikhara.position.y = 3.6;
    westVimanaGroup.add(westShikhara);

    const westStupi = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 12), goldMaterial);
    westStupi.position.y = 4.15;
    westVimanaGroup.add(westStupi);

    templeGroup.add(westVimanaGroup);

    // 4. MIDDLE RECLINING VISHNU SHRINE (Anantasayana Mandapa)
    const middleShrineGeo = new THREE.BoxGeometry(3.2, 1.4, 2.2);
    const middleShrineMesh = new THREE.Mesh(middleShrineGeo, stoneMaterial);
    middleShrineMesh.position.set(0, 1.5, -1.5);
    middleShrineMesh.castShadow = true;
    templeGroup.add(middleShrineMesh);

    // 5. PERIMETER ENCLOSURE WALL WITH NANDI GUARDIAN SCULPTURES
    const wallHeight = 0.9;
    const wallThickness = 0.5;

    // Wall sections
    const walls = [
      { size: [12, wallHeight, wallThickness], pos: [0, 0.8 + wallHeight / 2, 7.5] }, // Front East
      { size: [12, wallHeight, wallThickness], pos: [0, 0.8 + wallHeight / 2, -7.5] }, // Back West
      { size: [wallThickness, wallHeight, 15], pos: [6, 0.8 + wallHeight / 2, 0] }, // Right North
      { size: [wallThickness, wallHeight, 15], pos: [-6, 0.8 + wallHeight / 2, 0] } // Left South
    ];

    walls.forEach(w => {
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]), stoneMaterial);
      wallMesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
      wallMesh.castShadow = true;
      templeGroup.add(wallMesh);
    });

    // Sculpted Couchant Nandi Bulls along the perimeter parapet
    const nandiGroup = new THREE.Group();
    const createNandi = () => {
      const nandi = new THREE.Group();
      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.35), stoneMaterial);
      body.position.y = 0.18;
      nandi.add(body);
      // Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.22), stoneMaterial);
      head.position.set(0.3, 0.32, 0);
      nandi.add(head);
      // Horns
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), darkBasaltMaterial);
      hornL.rotation.z = -0.4;
      hornL.position.set(0.28, 0.48, 0.08);
      const hornR = hornL.clone();
      hornR.position.set(0.28, 0.48, -0.08);
      nandi.add(hornL);
      nandi.add(hornR);
      // Hump
      const hump = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), stoneMaterial);
      hump.position.set(0.12, 0.38, 0);
      nandi.add(hump);
      return nandi;
    };

    // Place Nandis on north & south walls
    for (let i = 0; i < 7; i++) {
      const nandiN = createNandi();
      nandiN.position.set(6, 1.7, -6 + i * 2);
      nandiN.rotation.y = -Math.PI / 2;
      nandiGroup.add(nandiN);

      const nandiS = createNandi();
      nandiS.position.set(-6, 1.7, -6 + i * 2);
      nandiS.rotation.y = Math.PI / 2;
      nandiGroup.add(nandiS);
    }
    // East and West walls
    for (let j = 0; j < 5; j++) {
      const nandiE = createNandi();
      nandiE.position.set(-4 + j * 2, 1.7, 7.5);
      nandiE.rotation.y = 0;
      nandiGroup.add(nandiE);

      const nandiW = createNandi();
      nandiW.position.set(-4 + j * 2, 1.7, -7.5);
      nandiW.rotation.y = Math.PI;
      nandiGroup.add(nandiW);
    }
    templeGroup.add(nandiGroup);

    // 6. ATMOSPHERIC PARTICLES (Dust Motes & Golden Sea Spray)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 35;
      particlePositions[p + 1] = Math.random() * 12;
      particlePositions[p + 2] = (Math.random() - 0.5) * 35;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4a85a,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. LIGHTING SETUP
    const setupLights = (mode: 'dawn' | 'golden' | 'night' | 'wireframe') => {
      lightsGroup.clear();

      if (mode === 'dawn') {
        scene.background = new THREE.Color(0x241416);
        scene.fog = new THREE.FogExp2(0x241416, 0.022);
        
        const hemiLight = new THREE.HemisphereLight(0xffbfa3, 0x1f1412, 0.8);
        lightsGroup.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xff8c5a, 2.2);
        sunLight.position.set(-25, 6, 12);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        lightsGroup.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xa38cff, 0.5);
        fillLight.position.set(20, 10, -10);
        lightsGroup.add(fillLight);
      } else if (mode === 'golden') {
        scene.background = new THREE.Color(0x1a1510);
        scene.fog = new THREE.FogExp2(0x1a1510, 0.02);

        const hemiLight = new THREE.HemisphereLight(0xffe8c2, 0x241a12, 1.0);
        lightsGroup.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xffaa40, 2.8);
        sunLight.position.set(18, 14, 18);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        lightsGroup.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xd4a85a, 0.3);
        lightsGroup.add(ambientLight);
      } else if (mode === 'night') {
        scene.background = new THREE.Color(0x0c0a08);
        scene.fog = new THREE.FogExp2(0x0c0a08, 0.035);

        const moonLight = new THREE.DirectionalLight(0x7590b8, 0.6);
        moonLight.position.set(-15, 25, -15);
        moonLight.castShadow = true;
        lightsGroup.add(moonLight);

        const ambientNight = new THREE.AmbientLight(0x1a2030, 0.35);
        lightsGroup.add(ambientNight);

        // Warm flickering Deepam oil lamps inside sanctum and at gate
        const deepam1 = new THREE.PointLight(0xff9922, 2.5, 8);
        deepam1.position.set(0, 2, 2);
        lightsGroup.add(deepam1);

        const deepam2 = new THREE.PointLight(0xff7711, 2.0, 7);
        deepam2.position.set(0, 2, -4.5);
        lightsGroup.add(deepam2);

        const deepam3 = new THREE.PointLight(0xffaa33, 1.8, 9);
        deepam3.position.set(0, 1.5, 7.8);
        lightsGroup.add(deepam3);
      } else if (mode === 'wireframe') {
        scene.background = new THREE.Color(0x080c10);
        scene.fog = new THREE.FogExp2(0x080c10, 0.02);

        const ambientWire = new THREE.AmbientLight(0xd4a85a, 1.2);
        lightsGroup.add(ambientWire);
      }
    };

    setupLights(lightingMode);

    // Animation Loop
    let lastTime = 0;
    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Auto-rotation if active
      if (autoRotate && !orbitState.current.isDragging) {
        orbitState.current.targetRotation.y += delta * 0.2;
      }

      // Smooth camera interpolation
      orbitState.current.rotation.x += (orbitState.current.targetRotation.x - orbitState.current.rotation.x) * 0.08;
      orbitState.current.rotation.y += (orbitState.current.targetRotation.y - orbitState.current.rotation.y) * 0.08;
      orbitState.current.distance += (orbitState.current.targetDistance - orbitState.current.distance) * 0.08;
      orbitState.current.currentLookAt.lerp(orbitState.current.targetLookAt, 0.08);

      // Clamp X tilt
      orbitState.current.rotation.x = Math.max(0.05, Math.min(Math.PI / 2.2, orbitState.current.rotation.x));

      // Calculate camera position in spherical coords
      const r = orbitState.current.distance;
      const phi = orbitState.current.rotation.x;
      const theta = orbitState.current.rotation.y;

      camera.position.x = orbitState.current.currentLookAt.x + r * Math.sin(theta) * Math.cos(phi);
      camera.position.y = orbitState.current.currentLookAt.y + r * Math.sin(phi);
      camera.position.z = orbitState.current.currentLookAt.z + r * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(orbitState.current.currentLookAt);

      // Gently animate floating gold dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let p = 1; p < particleCount * 3; p += 3) {
        positions[p] += delta * 0.2;
        if (positions[p] > 12) positions[p] = 0.2;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // Event Handlers for Mouse/Touch Orbiting
    const domEl = renderer.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      orbitState.current.isDragging = true;
      orbitState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!orbitState.current.isDragging) return;
      const deltaX = e.clientX - orbitState.current.previousMousePosition.x;
      const deltaY = e.clientY - orbitState.current.previousMousePosition.y;

      orbitState.current.targetRotation.y -= deltaX * 0.006;
      orbitState.current.targetRotation.x += deltaY * 0.006;

      orbitState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      orbitState.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitState.current.targetDistance = Math.max(7, Math.min(35, orbitState.current.targetDistance + e.deltaY * 0.02));
      setCameraZoomLevel(parseFloat((22 / orbitState.current.targetDistance).toFixed(1)));
    };

    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Window resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update lighting mode and material wireframe state
  useEffect(() => {
    if (!sceneRef.current || !lightsGroupRef.current || !materialsRef.current || !templeGroupRef.current) return;
    
    // Toggle wireframe mode
    const isWire = lightingMode === 'wireframe';
    templeGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isWire) {
          child.material = materialsRef.current!.wire;
        } else {
          if (child.geometry instanceof THREE.ConeGeometry) {
            child.material = materialsRef.current!.gold;
          } else if (child.geometry instanceof THREE.CylinderGeometry && child.geometry.parameters.radialSegments === 16) {
            child.material = materialsRef.current!.darkBasalt;
          } else {
            child.material = materialsRef.current!.stone;
          }
        }
      }
    });

    // Re-setup lighting
    if (lightingMode === 'dawn') {
      sceneRef.current.background = new THREE.Color(0x241416);
      sceneRef.current.fog = new THREE.FogExp2(0x241416, 0.022);
    } else if (lightingMode === 'golden') {
      sceneRef.current.background = new THREE.Color(0x1a1510);
      sceneRef.current.fog = new THREE.FogExp2(0x1a1510, 0.02);
    } else if (lightingMode === 'night') {
      sceneRef.current.background = new THREE.Color(0x0c0a08);
      sceneRef.current.fog = new THREE.FogExp2(0x0c0a08, 0.035);
    } else if (lightingMode === 'wireframe') {
      sceneRef.current.background = new THREE.Color(0x080c10);
      sceneRef.current.fog = new THREE.FogExp2(0x080c10, 0.02);
    }
  }, [lightingMode]);

  // Hotspot selection and camera focus
  const handleSelectHotspot = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    if (onSelectHotspot) onSelectHotspot(hotspot);

    // Smoothly focus camera onto hotspot position
    orbitState.current.targetLookAt.set(hotspot.position[0], hotspot.position[1], hotspot.position[2]);
    orbitState.current.targetDistance = 11;
    setAutoRotate(false);
  };

  const handleResetCamera = () => {
    setSelectedHotspot(null);
    orbitState.current.targetRotation.x = 0.35;
    orbitState.current.targetRotation.y = 0.75;
    orbitState.current.targetDistance = 22;
    orbitState.current.targetLookAt.set(0, 3, 0);
    setAutoRotate(true);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      orbitState.current.targetDistance = Math.max(7, orbitState.current.targetDistance - 3);
    } else {
      orbitState.current.targetDistance = Math.min(35, orbitState.current.targetDistance + 3);
    }
    setCameraZoomLevel(parseFloat((22 / orbitState.current.targetDistance).toFixed(1)));
  };

  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setIsCapturing(true);
    setTimeout(() => {
      try {
        const dataUrl = rendererRef.current!.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `DHAROHAR-Shore-Temple-3D-${lightingMode}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Snapshot capture failed', err);
      } finally {
        setIsCapturing(false);
      }
    }, 150);
  };

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    const parentContainer = mountRef.current.parentElement;
    if (!document.fullscreenElement) {
      parentContainer?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div id="shore-temple-3d-container" className="relative w-full h-[640px] lg:h-[720px] rounded-2xl overflow-hidden border border-[#D4A85A]/30 bg-[#17130F] shadow-2xl group">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Status Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#17130F]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4A85A]/40 shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A85A]">
            Spatial 3D Model • 700 CE
          </span>
          <span className="text-[11px] text-[#F3EBDD]/60 border-l border-[#D4A85A]/30 pl-2">
            Zoom {cameraZoomLevel}x
          </span>
        </div>
        <div className="text-xs text-[#F3EBDD]/70 bg-[#17130F]/70 px-3 py-1 rounded-md backdrop-blur-sm hidden sm:inline-block max-w-xs">
          Drag to orbit • Scroll to zoom • Click gold markers for deep archaeological context
        </div>
      </div>

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Sound toggle */}
        <button
          id="btn-3d-ambient-sound"
          onClick={toggleAmbientSound}
          title={ambientSound ? "Mute Ocean & Temple Chime" : "Play Ambient Ocean Waves & Sacred Chime"}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all flex items-center gap-1.5 text-xs ${
            ambientSound 
              ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-lg shadow-[#D4A85A]/20' 
              : 'bg-[#2B2118]/80 text-[#F3EBDD] border-[#D4A85A]/30 hover:border-[#D4A85A] hover:bg-[#2B2118]'
          }`}
        >
          {ambientSound ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{ambientSound ? 'Ambient Active' : 'Sound On'}</span>
        </button>

        {/* Auto Rotate Toggle */}
        <button
          id="btn-3d-autorotate"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Pause Auto-Rotation" : "Enable 360° Auto-Rotation"}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            autoRotate 
              ? 'bg-[#D4A85A]/20 text-[#D4A85A] border-[#D4A85A]' 
              : 'bg-[#2B2118]/80 text-[#F3EBDD]/70 border-[#D4A85A]/30 hover:text-[#F3EBDD]'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Snapshot Capture */}
        <button
          id="btn-3d-snapshot"
          onClick={handleCaptureSnapshot}
          disabled={isCapturing}
          title="Save High-Res 3D Architectural Screenshot"
          className="p-2.5 rounded-xl border border-[#D4A85A]/30 bg-[#2B2118]/80 text-[#F3EBDD] hover:border-[#D4A85A] hover:text-[#D4A85A] backdrop-blur-md transition-all"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="btn-3d-fullscreen"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2.5 rounded-xl border border-[#D4A85A]/30 bg-[#2B2118]/80 text-[#F3EBDD] hover:border-[#D4A85A] hover:text-[#D4A85A] backdrop-blur-md transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Hotspots Overlay Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] md:max-w-xl">
        <div className="bg-[#17130F]/90 backdrop-blur-md p-3 rounded-2xl border border-[#D4A85A]/40 shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#D4A85A]/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A85A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Archaeological Hotspots ({hotspots.length})
            </span>
            <button 
              id="btn-reset-3d-camera"
              onClick={handleResetCamera}
              className="text-[11px] text-[#F3EBDD]/70 hover:text-[#D4A85A] flex items-center gap-1 transition-colors"
            >
              <Compass className="w-3 h-3" />
              Reset View
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {hotspots.map((hotspot) => {
              const isSelected = selectedHotspot?.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  id={`hotspot-btn-${hotspot.id}`}
                  onClick={() => handleSelectHotspot(hotspot)}
                  className={`px-2.5 py-2 rounded-xl text-left transition-all border text-xs flex flex-col ${
                    isSelected
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md shadow-[#D4A85A]/30 scale-[1.02]'
                      : 'bg-[#2B2118]/80 text-[#F3EBDD] border-[#D4A85A]/20 hover:border-[#D4A85A]/60 hover:bg-[#2B2118]'
                  }`}
                >
                  <span className="font-semibold truncate">{hotspot.title.split('(')[0]}</span>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-[#17130F]/80' : 'text-[#D4A85A]'}`}>
                    {hotspot.subtitle.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Lighting & Camera Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
        {/* Zoom In/Out Buttons */}
        <div className="flex flex-col gap-1 bg-[#17130F]/90 backdrop-blur-md p-1 rounded-xl border border-[#D4A85A]/30 shadow-lg">
          <button
            id="btn-3d-zoom-in"
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2 text-[#F3EBDD] hover:text-[#D4A85A] hover:bg-[#2B2118] rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-[#D4A85A]/20 mx-1" />
          <button
            id="btn-3d-zoom-out"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2 text-[#F3EBDD] hover:text-[#D4A85A] hover:bg-[#2B2118] rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Lighting Selector Pill */}
        <div className="flex items-center gap-1 bg-[#17130F]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#D4A85A]/40 shadow-xl">
          <button
            id="btn-light-dawn"
            onClick={() => setLightingMode('dawn')}
            title="Dawn Sunrise (6:00 AM)"
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              lightingMode === 'dawn'
                ? 'bg-[#B58A52] text-[#17130F] font-bold shadow-md'
                : 'text-[#F3EBDD]/70 hover:text-[#F3EBDD] hover:bg-[#2B2118]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Dawn</span>
          </button>

          <button
            id="btn-light-golden"
            onClick={() => setLightingMode('golden')}
            title="Golden Hour (4:30 PM)"
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              lightingMode === 'golden'
                ? 'bg-[#D4A85A] text-[#17130F] font-bold shadow-md'
                : 'text-[#F3EBDD]/70 hover:text-[#F3EBDD] hover:bg-[#2B2118]'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Golden</span>
          </button>

          <button
            id="btn-light-night"
            onClick={() => setLightingMode('night')}
            title="Midnight Deepam (10:00 PM)"
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              lightingMode === 'night'
                ? 'bg-[#2B2118] text-[#D4A85A] border border-[#D4A85A] font-bold shadow-md'
                : 'text-[#F3EBDD]/70 hover:text-[#F3EBDD] hover:bg-[#2B2118]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">Night</span>
          </button>

          <button
            id="btn-light-wireframe"
            onClick={() => setLightingMode('wireframe')}
            title="Archaeological LiDAR Scan Mode"
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              lightingMode === 'wireframe'
                ? 'bg-cyan-900 text-cyan-200 border border-cyan-400 font-bold shadow-md'
                : 'text-[#F3EBDD]/70 hover:text-[#F3EBDD] hover:bg-[#2B2118]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LiDAR</span>
          </button>
        </div>
      </div>

      {/* Contextual Hotspot Detail Modal / Drawer */}
      {selectedHotspot && (
        <div className="absolute top-16 right-4 z-20 w-80 md:w-96 bg-[#17130F]/95 backdrop-blur-xl border border-[#D4A85A] rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-[#D4A85A]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#D4A85A]/20 text-[#D4A85A] text-[10px] uppercase font-bold tracking-wider">
                  Hotspot In Focus
                </span>
              </div>
              <h4 className="font-display text-lg font-bold text-[#F3EBDD] mt-1">
                {selectedHotspot.title}
              </h4>
              <p className="text-xs text-[#D4A85A] font-subheading italic">
                {selectedHotspot.subtitle}
              </p>
            </div>
            <button
              id="btn-close-hotspot-detail"
              onClick={() => setSelectedHotspot(null)}
              className="p-1.5 rounded-full bg-[#2B2118] text-[#F3EBDD]/70 hover:text-[#F3EBDD] hover:bg-[#B58A52]/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedHotspot.detailImage && (
            <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#D4A85A]/30 shadow-inner">
              <img 
                src={selectedHotspot.detailImage} 
                alt={selectedHotspot.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-transparent to-transparent opacity-60" />
            </div>
          )}

          <div className="space-y-3 text-xs text-[#F3EBDD]/90 leading-relaxed">
            <p className="border-l-2 border-[#D4A85A] pl-2.5 text-[#F3EBDD]/80">
              {selectedHotspot.architecturalSignificance}
            </p>

            <div className="bg-[#2B2118]/70 p-3 rounded-xl border border-[#D4A85A]/20">
              <div className="text-[11px] font-bold text-[#D4A85A] mb-1 flex items-center gap-1.5">
                <Info className="w-3 h-3" />
                Epigraphical & Historical Chronicle
              </div>
              <p className="text-[11px] text-[#F3EBDD]/80">
                {selectedHotspot.eraFact}
              </p>
            </div>

            {selectedHotspot.audioGuideSnippet && (
              <div className="p-2.5 rounded-xl bg-[#D4A85A]/10 border border-[#D4A85A]/30 flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-[#D4A85A] shrink-0 mt-0.5" />
                <p className="text-[11px] italic text-[#F3EBDD]/90">
                  "{selectedHotspot.audioGuideSnippet}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D4A85A]/20 flex items-center justify-between">
            <button
              id="btn-3d-inspect-close"
              onClick={handleResetCamera}
              className="text-xs text-[#D4A85A] hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              Return to Full Temple
            </button>
            <span className="text-[10px] text-[#F3EBDD]/50">DHAROHAR Spatial Twin</span>
          </div>
        </div>
      )}
    </div>
  );
};
