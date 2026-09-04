import React, { useState } from 'react';
import { Compass, Eye, Sparkles, Smartphone, ChevronRight, ChevronLeft } from 'lucide-react';

export default function VirtualTour360({ project }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [panAngle, setPanAngle] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);

  const scenes = [
    {
      id: 'scene-ext',
      title: 'Point de Vue 1 : Entrée Principale & Allée Paysagère',
      location: 'Extérieur Façade',
      bgGradient: 'from-amber-950 via-slate-900 to-sky-950',
      description: 'Vue panoramique 360° depuis le portail d\'entrée. Mise en valeur des espaces verts et du parking pavé.',
      hotspots: [
        { label: 'Entrer dans le Salon', targetIndex: 1, x: 55, y: 50 },
        { label: 'Aller vers la Piscine', targetIndex: 3, x: 85, y: 55 }
      ]
    },
    {
      id: 'scene-salon',
      title: 'Point de Vue 2 : Grand Salon & Salle à Manger',
      location: 'Intérieur RDC',
      bgGradient: 'from-slate-900 via-amber-900/40 to-slate-950',
      description: 'Espace de vie traversant de 35m² avec hauteur sous plafond 3.00m, baies vitrées aluminium et faux-plafond LED.',
      hotspots: [
        { label: 'Visiter la Suite Parentale', targetIndex: 2, x: 25, y: 48 },
        { label: 'Voir la Cuisine & Terrasse', targetIndex: 3, x: 75, y: 52 },
        { label: 'Sortir vers l\'Extérieur', targetIndex: 0, x: 10, y: 60 }
      ]
    },
    {
      id: 'scene-suite',
      title: 'Point de Vue 3 : Suite Parentale & Dressing',
      location: 'Chambre 1',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      description: 'Chambre spacieuse de 20m² avec salle de bain privative, dressing intégré et accès direct terrasse.',
      hotspots: [
        { label: 'Retour au Salon', targetIndex: 1, x: 50, y: 55 }
      ]
    },
    {
      id: 'scene-cui',
      title: 'Point de Vue 4 : Cuisine Moderne & Terrasse Piscine',
      location: 'Cuisine & Jardin',
      bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
      description: 'Cuisine îlot central ouverte sur la terrasse extérieure ombragée et la plage de piscine en teck.',
      hotspots: [
        { label: 'Retour au Salon', targetIndex: 1, x: 30, y: 50 },
        { label: 'Vue d\'Ensemble Façade', targetIndex: 0, x: 80, y: 45 }
      ]
    }
  ];

  const currentScene = scenes[currentSceneIndex];

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const delta = clientX - startX;
    setPanAngle(prev => (prev + delta * 0.1) % 360);
    setStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* 360 Top Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <h3 className="text-xs font-bold text-slate-100">{currentScene.title}</h3>
            <p className="text-[10px] text-slate-400">{currentScene.location} | Orientation: {Math.round(panAngle)}°</p>
          </div>
        </div>

        {/* Scene Navigation Pills */}
        <div className="flex items-center gap-1.5">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSceneIndex(idx)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                currentSceneIndex === idx
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Point {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Panorama Viewing Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={`relative h-[480px] bg-gradient-to-r ${currentScene.bgGradient} overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center`}
      >
        {/* Panorama Grid & Ambient Architectural Perspective */}
        <div 
          style={{ transform: `translateX(${panAngle * 2}px)` }}
          className="absolute inset-0 flex items-center justify-around opacity-40 pointer-events-none transition-transform"
        >
          <div className="w-96 h-80 border-2 border-dashed border-orange-400/30 rounded-2xl flex items-center justify-center">
            <span className="text-xs font-mono text-orange-400/60 font-bold">Angle Architecture Panoramique</span>
          </div>
          <div className="w-96 h-80 border-2 border-dashed border-sky-400/30 rounded-2xl flex items-center justify-center">
            <span className="text-xs font-mono text-sky-400/60 font-bold">Perspectives & Baies Vitrées</span>
          </div>
        </div>

        {/* Virtual Room Title Stamp */}
        <div className="text-center z-10 p-6 bg-slate-950/70 backdrop-blur-md border border-slate-700/60 rounded-2xl max-w-lg shadow-2xl">
          <span className="text-[10px] uppercase tracking-widest text-orange-400 font-black">Visite Virtuelle 360° Immersive</span>
          <h2 className="text-xl font-black text-white mt-1">{currentScene.title}</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{currentScene.description}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {currentScene.hotspots.map((hs, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSceneIndex(hs.targetIndex);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
              >
                <span>{hs.label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* 360 Drag Compass indicator */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
          <Compass className="w-4 h-4 text-orange-400" />
          <span>Glissez horizontalement pour pivoter à 360°</span>
        </div>
      </div>

      {/* Footer info */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Compatible Smartphone, Tablette & Casque VR (WebXR Ready)</span>
        <span className="text-emerald-400 font-bold">4 Points Clés Générés</span>
      </div>
    </div>
  );
}
