import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

export default function SignaturePad({ onSaveSignature, initialSignature = null }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284c7'; // Professional blue ink
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (onSaveSignature && canvasRef.current) {
      onSaveSignature(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onSaveSignature) onSaveSignature(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <PenTool className="w-4 h-4 text-orange-400" />
          <span>Signature Électronique (Signez avec le doigt ou la souris)</span>
        </div>
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-red-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Effacer</span>
        </button>
      </div>

      <div className="relative border-2 border-dashed border-slate-700 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={450}
          height={140}
          className="touch-none cursor-crosshair w-full max-w-[450px]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute pointer-events-none text-xs text-slate-600 font-medium">
            Signer ici pour valider le contrat & dossier
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span>Horodatage SHA-256 certifié BTPRO Africa</span>
        {hasDrawn && <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-3 h-3"/> Signature enregistrée</span>}
      </div>
    </div>
  );
}
