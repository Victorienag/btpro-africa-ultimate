import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Layers, 
  Download, 
  Maximize, 
  Lock, 
  Check, 
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { generateClientEstimatePdf } from '../../services/pdfGenerator';
import { initiatePayment, completeTestPayment } from '../../services/cinetpay';

export default function FloorplanSVGViewer() {
  const { activeProject, plans, quotation } = useProject();
  const { user, canDownloadPlan, consumeDownloadToken, addPaidDownload } = useAuth();

  const [activeTab, setActiveTab] = useState('elevation'); // 'masse', 'fondation', 'elevation', 'electricite', 'plomberie', 'toiture'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(null);

  const tabs = [
    { id: 'masse', label: 'Plan de Masse' },
    { id: 'fondation', label: 'Plan Fondation' },
    { id: 'elevation', label: 'Plan Élévation / Distribution' },
    { id: 'electricite', label: 'Plan Électricité' },
    { id: 'plomberie', label: 'Plan Plomberie' },
    { id: 'toiture', label: 'Plan Toiture & Charpente' },
  ];

  const handleDownload = async () => {
    if (!canDownloadPlan()) {
      alert('Veuillez débloquer le téléchargement à 1000 FCFA ou souscrire à un abonnement pro.');
      return;
    }
    consumeDownloadToken();
    generateClientEstimatePdf(activeProject, quotation, user);
  };

  const handlePay1000f = async () => {
    setIsProcessingPayment(true);
    try {
      const init = await initiatePayment({
        user,
        planKey: 'PROPRIETAIRE_DOWNLOAD',
        projectId: activeProject?.id,
        customAmount: 1000
      });

      // Immediate test simulator validation
      if (init.transaction_id) {
        await completeTestPayment(init.transaction_id);
        addPaidDownload();
        setPaymentSuccessMsg('Paiement CinetPay de 1 000 FCFA validé ! 1 Téléchargement débloqué.');
        setTimeout(() => setPaymentSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const currentSvg = plans?.[activeTab] || plans?.elevation || '<svg></svg>';

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Tabs Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action / Download Buttons */}
        <div className="flex items-center gap-2">
          {canDownloadPlan() ? (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger Dossier PDF</span>
            </button>
          ) : (
            <button
              onClick={handlePay1000f}
              disabled={isProcessingPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white rounded-lg transition-all shadow"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isProcessingPayment ? 'Paiement en cours...' : 'Payer 1000 FCFA pour Télécharger'}</span>
            </button>
          )}
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="bg-emerald-950 border-b border-emerald-700 text-emerald-300 px-4 py-2 text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* SVG Container */}
      <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[520px]">
        <div 
          className="w-full max-w-4xl"
          dangerouslySetInnerHTML={{ __html: currentSvg }}
        />
      </div>

      {/* Technical Standards Footer Note */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          Génération vectorielle SVG conforme aux normes d'ingénierie et d'urbanisme africaines.
        </span>
        <span className="font-mono text-slate-300 font-bold">
          Terrain: {activeProject?.length || 20}m × {activeProject?.width || 15}m | {activeProject?.city}, {activeProject?.country}
        </span>
      </div>
    </div>
  );
}
