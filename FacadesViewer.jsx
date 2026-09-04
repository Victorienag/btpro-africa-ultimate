import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Eye, Download, Image as ImageIcon } from 'lucide-react';

export default function FacadesViewer() {
  const { activeProject } = useProject();
  const [selectedFacade, setSelectedFacade] = useState('front'); // 'front', 'back', 'left', 'right'

  const L = Number(activeProject?.length) || 20;
  const W = Number(activeProject?.width) || 15;
  const height = 3.5; // single floor height

  const facades = [
    { id: 'front', label: 'Façade Principale (Face Avant)', width: L * 0.7 },
    { id: 'back', label: 'Façade Postérieure (Arrière)', width: L * 0.7 },
    { id: 'left', label: 'Façade Latérale Gauche', width: W * 0.7 },
    { id: 'right', label: 'Façade Latérale Droite', width: W * 0.7 },
  ];

  const currentFacade = facades.find(f => f.id === selectedFacade) || facades[0];
  const fw = currentFacade.width * 28; // scale
  const fh = height * 45;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Facade Selector Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {facades.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFacade(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedFacade === f.id
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vector Facade Rendering Canvas */}
      <div className="p-6 bg-slate-950 flex items-center justify-center min-h-[500px]">
        <svg viewBox="0 0 850 480" className="w-full max-w-4xl h-auto font-mono">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="100%" height="100%" fill="url(#skyGrad)" />

          {/* Header Title */}
          <g transform="translate(25, 30)">
            <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | ÉLÉVATION ARCHITECTURALE - {currentFacade.label.toUpperCase()}</text>
            <text x="0" y="16" fill="#94a3b8" font-size="10">Hauteur sous plafond: 3.00m | Toiture bac alu 5/10e brun sahara | Enduit gratté ton pierre</text>
          </g>

          {/* Ground Line */}
          <line x1="40" y1="390" x2="810" y2="390" stroke="#475569" stroke-width="3" />
          <polygon points="40,390 810,390 810,430 40,430" fill="#0f172a" opacity="0.8" />
          <text x="50" y="415" fill="#64748b" font-size="10">Terrain Naturel (TN = ±0.00)</text>

          {/* Main Facade Body Extrusion */}
          <g transform="translate(180, 160)">
            
            {/* Soubassement / Dalle surélevée 40cm */}
            <rect x="0" y="190" width="${fw}" height="40" fill="#334155" stroke="#475569" stroke-width="1.5" />
            <text x="${fw / 2}" y="215" fill="#94a3b8" font-size="9" text-anchor="middle">Soubassement Béton (+0.40m)</text>

            {/* Corps du mur principal */}
            <rect x="0" y="40" width="${fw}" height="150" fill="url(#wallGrad)" stroke="#334155" stroke-width="2" />

            {/* Toiture Tuile / Bac Alu (Pignon triangulaire moderne) */}
            <polygon points="-20,40 ${fw / 2},-40 ${fw + 20},40" fill="url(#roofGrad)" stroke="#431407" stroke-width="2" />
            
            {/* Gouttière & Acrotère */}
            <rect x="-25" y="36" width="${fw + 50}" height="8" fill="#1e293b" />

            {/* Portes et Baies vitrées adaptées selon la façade */}
            {selectedFacade === 'front' ? (
              <>
                {/* Porte d'Entrée Principale Sécurisée */}
                <rect x="40" y="80" width="45" height="110" fill="#451a03" stroke="#78350f" stroke-width="2" />
                <circle cx="80" cy="135" r="3" fill="#eab308" />
                <text x="62" y="140" fill="#fef08a" font-size="8" text-anchor="middle">Porte 1.0m</text>

                {/* Baie Vitrée Salon */}
                <rect x="120" y="90" width="90" height="90" fill="#0284c7" fill-opacity="0.3" stroke="#0369a1" stroke-width="2" />
                <line x1="165" y1="90" x2="165" y2="180" stroke="#0369a1" stroke-width="1.5" />
                <text x="165" y="140" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Baie Vitrée 2.20m</text>

                {/* Fenêtre Chambre */}
                <rect x="250" y="95" width="55" height="60" fill="#0284c7" fill-opacity="0.3" stroke="#0369a1" stroke-width="2" />
                <line x1="277" y1="95" x2="277" y2="155" stroke="#0369a1" stroke-width="1.5" />
                <text x="277" y="130" fill="#ffffff" font-size="8" text-anchor="middle">Fenêtre 1.20m</text>
              </>
            ) : (
              <>
                {/* Fenêtres standard */}
                <rect x="60" y="95" width="60" height="60" fill="#0284c7" fill-opacity="0.3" stroke="#0369a1" stroke-width="2" />
                <rect x="180" y="95" width="60" height="60" fill="#0284c7" fill-opacity="0.3" stroke="#0369a1" stroke-width="2" />
                <rect x="280" y="115" width="35" height="40" fill="#0284c7" fill-opacity="0.3" stroke="#0369a1" stroke-width="2" />
                <text x="297" y="140" fill="#ffffff" font-size="7" text-anchor="middle">Imposte SDB</text>
              </>
            )}

            {/* Cotation Hauteur */}
            <line x1="-40" y1="40" x2="-40" y2="190" stroke="#f97316" stroke-width="1.5" />
            <text x="-50" y="120" fill="#f97316" font-size="10" font-weight="bold" text-anchor="end">H = 3.00m</text>

            <line x1="-40" y1="-40" x2="-40" y2="40" stroke="#f97316" stroke-width="1.5" />
            <text x="-50" y="0" fill="#f97316" font-size="9" text-anchor="end">Toiture +1.50m</text>
          </g>
        </svg>
      </div>

      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Extrusion 2D vers Élévation Façades générée automatiquement d'après les dimensions du bâtiment.</span>
        <span className="text-orange-400 font-mono font-bold">Échelle: 1/50</span>
      </div>
    </div>
  );
}
