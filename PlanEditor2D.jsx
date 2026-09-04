import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo2, 
  Redo2, 
  Plus, 
  Car, 
  Waves, 
  Fence, 
  DoorOpen, 
  Trash2, 
  Move, 
  Maximize2,
  CheckCircle2,
  Download
} from 'lucide-react';
import { downloadDxfPlan } from '../../services/dxfExporter';

export default function PlanEditor2D({ project, onSaveRooms }) {
  const L = Number(project?.length) || 20;
  const W = Number(project?.width) || 15;
  const scale = 25; // pixels per meter

  // Initial Rooms state
  const [rooms, setRooms] = useState(() => [
    { id: 'r1', name: 'Salon & Séjour', x: 3, y: 3, w: 6, h: 5, color: '#f59e0b', area: 30 },
    { id: 'r2', name: 'Cuisine', x: 9.5, y: 3, w: 4, h: 4, color: '#f97316', area: 16 },
    { id: 'r3', name: 'Chambre Parentale', x: 3, y: 8.5, w: 4.5, h: 4, color: '#38bdf8', area: 18 },
    { id: 'r4', name: 'Chambre 2', x: 8, y: 8.5, w: 4, h: 3.5, color: '#818cf8', area: 14 },
    { id: 'r5', name: 'Salle d\'Eau', x: 12.5, y: 8.5, w: 2.5, h: 3.5, color: '#10b981', area: 8.75 }
  ]);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  // Push state to history
  const pushState = (newRooms) => {
    setHistory(prev => [...prev.slice(-20), rooms]);
    setRedoStack([]);
    setRooms(newRooms);
    if (onSaveRooms) onSaveRooms(newRooms);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, rooms]);
    setHistory(prev => prev.slice(0, -1));
    setRooms(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, rooms]);
    setRedoStack(prev => prev.slice(0, -1));
    setRooms(next);
  };

  // Keyboard shortcut Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, redoStack, rooms]);

  // Add Special Objects
  const addElement = (type) => {
    const id = `elem-${Date.now()}`;
    let newElem;

    switch (type) {
      case 'room':
        newElem = { id, name: 'Nouvelle Pièce', x: 4, y: 4, w: 4, h: 3.5, color: '#38bdf8', area: 14 };
        break;
      case 'parking':
        newElem = { id, name: 'Parking (2 VL)', x: 1, y: W - 5.5, w: 5, h: 5, color: '#0284c7', area: 25, isSpecial: true };
        break;
      case 'pool':
        newElem = { id, name: 'Piscine Débordement', x: L - 7, y: 2, w: 6, h: 3.5, color: '#06b6d4', area: 21, isSpecial: true };
        break;
      case 'fence':
        newElem = { id, name: 'Clôture Périphérique', x: 0.5, y: 0.5, w: L - 1, h: W - 1, color: '#64748b', isSpecial: true, isFence: true };
        break;
      case 'gate':
        newElem = { id, name: 'Portail Coulissant 4m', x: 2, y: W - 0.8, w: 4, h: 0.6, color: '#10b981', area: 2.4, isSpecial: true };
        break;
      default:
        return;
    }

    pushState([...rooms, newElem]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    pushState(rooms.filter(r => r.id !== selectedId));
    setSelectedId(null);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e, room) => {
    setSelectedId(room.id);
    setDraggingId(room.id);
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;
    setDragOffset({ x: mouseX - room.x, y: mouseY - room.y });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    // Magnet grid snapping (0.25m step)
    const rawX = mouseX - dragOffset.x;
    const rawY = mouseY - dragOffset.y;
    const snappedX = Math.round(rawX * 4) / 4;
    const snappedY = Math.round(rawY * 4) / 4;

    setRooms(prev => prev.map(r => {
      if (r.id === draggingId) {
        return {
          ...r,
          x: Math.max(0, Math.min(L - r.w, snappedX)),
          y: Math.max(0, Math.min(W - r.h, snappedY))
        };
      }
      return r;
    }));
  };

  const handleMouseUp = () => {
    if (draggingId) {
      setDraggingId(null);
      pushState(rooms);
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedId);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Editor Toolbar */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Special Building Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => addElement('room')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter Pièce</span>
          </button>
          <button
            onClick={() => addElement('parking')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <Car className="w-3.5 h-3.5 text-sky-400" />
            <span>Ajouter Parking</span>
          </button>
          <button
            onClick={() => addElement('pool')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ajouter Piscine</span>
          </button>
          <button
            onClick={() => addElement('fence')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <Fence className="w-3.5 h-3.5 text-amber-400" />
            <span>Ajouter Clôture</span>
          </button>
          <button
            onClick={() => addElement('gate')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ajouter Portail</span>
          </button>
        </div>

        {/* Undo/Redo & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 rounded-lg transition-colors"
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 rounded-lg transition-colors"
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {selectedId && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          )}

          <button
            onClick={() => downloadDxfPlan(project, rooms)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DXF AutoCAD</span>
          </button>
        </div>
      </div>

      {/* Interactive 2D Canvas Area */}
      <div 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative overflow-auto p-6 bg-slate-950 cad-grid flex items-center justify-center min-h-[500px]"
      >
        {/* Terrain Boundary Box */}
        <div 
          style={{
            width: `${L * scale}px`,
            height: `${W * scale}px`
          }}
          className="relative bg-slate-900/90 border-2 border-dashed border-amber-500/60 rounded-sm shadow-2xl select-none"
        >
          {/* Dimension Labels on Boundary */}
          <div className="absolute -top-6 left-0 w-full text-center text-xs font-mono font-bold text-amber-400">
            Longueur Terrain: {L} m
          </div>
          <div className="absolute top-1/2 -left-12 -rotate-90 text-xs font-mono font-bold text-amber-400">
            Largeur: {W} m
          </div>

          {/* Draggable Room Elements */}
          {rooms.map(room => {
            const isSelected = selectedId === room.id;

            return (
              <div
                key={room.id}
                onMouseDown={(e) => handleMouseDown(e, room)}
                style={{
                  left: `${room.x * scale}px`,
                  top: `${room.y * scale}px`,
                  width: `${room.w * scale}px`,
                  height: `${room.h * scale}px`,
                  backgroundColor: `${room.color}25`,
                  borderColor: isSelected ? '#f97316' : room.color,
                }}
                className={`absolute border-2 rounded cursor-move flex flex-col items-center justify-center p-1 transition-shadow group ${
                  isSelected ? 'ring-2 ring-orange-500 shadow-xl z-20' : 'z-10 hover:border-white'
                }`}
              >
                {/* Auto Cotation Tag */}
                <span className="text-[10px] font-mono font-bold text-slate-100 text-center leading-tight truncate px-1">
                  {room.name}
                </span>
                <span className="text-[9px] font-mono font-semibold text-slate-300">
                  {room.w.toFixed(1)}m × {room.h.toFixed(1)}m
                </span>
                <span className="text-[9px] font-mono font-bold text-orange-400">
                  ({(room.w * room.h).toFixed(1)} m²)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Element Quick Properties */}
      {selectedRoom && (
        <div className="bg-slate-800/80 border-t border-slate-700 p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-orange-400">Élément sélectionné :</span>
            <input
              type="text"
              value={selectedRoom.name}
              onChange={(e) => {
                const val = e.target.value;
                setRooms(prev => prev.map(r => r.id === selectedId ? { ...r, name: val } : r));
              }}
              className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-100 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Largeur (m):</span>
              <input
                type="number"
                step="0.5"
                min="1"
                max={L}
                value={selectedRoom.w}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRooms(prev => prev.map(r => r.id === selectedId ? { ...r, w: val } : r));
                }}
                className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-100 text-center"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span>Longueur (m):</span>
              <input
                type="number"
                step="0.5"
                min="1"
                max={W}
                value={selectedRoom.h}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRooms(prev => prev.map(r => r.id === selectedId ? { ...r, h: val } : r));
                }}
                className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-100 text-center"
              />
            </div>
            <span className="font-bold text-emerald-400">
              Surface : {(selectedRoom.w * selectedRoom.h).toFixed(2)} m²
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
