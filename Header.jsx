import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { 
  Building2, 
  Sparkles, 
  UserCheck, 
  Download, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  Layers,
  ChevronDown,
  Wrench,
  Bot
} from 'lucide-react';
import { formatFCFA } from '../../services/pdfGenerator';
import AIAssistantModal from '../ai/AIAssistantModal';

export default function Header() {
  const { user, login, logout, canDownloadPlan } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { activeProject } = useProject();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  BTPRO <span className="text-orange-500 font-black">AFRICA</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-mono font-bold">V1.0</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">LE SAAS BTP N°1 EN AFRIQUE</p>
              </div>
            </Link>

            {/* Current Active Project Pill */}
            {activeProject && (
              <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-slate-800">
                <span className="text-xs text-slate-400">Projet actif:</span>
                <span className="text-xs font-semibold bg-slate-800 text-orange-400 px-2.5 py-1 rounded-full border border-slate-700 max-w-[200px] truncate">
                  {activeProject.name} ({activeProject.type})
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">IA Ingénieur BTP</span>
            </button>

            {/* Role Tester Dropdown (Essential for testing all roles) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                title="Changer de rôle pour tester les scénarios"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="max-w-[110px] truncate">{user?.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Changer de Rôle (Mode Test)
                  </div>
                  <button
                    onClick={() => { login('proprio'); setShowRoleDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 text-slate-200 flex flex-col"
                  >
                    <span className="font-bold text-sky-400">1. Propriétaire (0 FCFA/m)</span>
                    <span className="text-[10px] text-slate-400">1000 FCFA / PDF | 3 projets max</span>
                  </button>
                  <button
                    onClick={() => { login('macon'); setShowRoleDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 text-slate-200 flex flex-col"
                  >
                    <span className="font-bold text-emerald-400">2. Maçon / Artisan (10 000 FCFA/m)</span>
                    <span className="text-[10px] text-slate-400">Plans illimités + Devis + Signature Pro</span>
                  </button>
                  <button
                    onClick={() => { login('archi'); setShowRoleDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 text-slate-200 flex flex-col"
                  >
                    <span className="font-bold text-purple-400">3. Architecte / Entreprise (50 000 FCFA/m)</span>
                    <span className="text-[10px] text-slate-400">Marketplace + Dossier Banque complet</span>
                  </button>
                  <button
                    onClick={() => { login('admin'); setShowRoleDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 text-slate-200 flex flex-col border-t border-slate-800"
                  >
                    <span className="font-bold text-orange-400">👑 5. Admin BTPRO (Toi)</span>
                    <span className="text-[10px] text-slate-400">Gestion prix, users, commissions, stats</span>
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="Switch Language FR / EN"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Download Status Badge for Owner */}
            {user?.role === 'PROPRIÉTAIRE' && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${canDownloadPlan() ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-amber-950/60 border-amber-500/40 text-amber-400'}`}>
                <Download className="w-3 h-3" />
                <span>{user.paid_downloads || 0} PDF dispo</span>
              </div>
            )}

            {/* Subscription Button */}
            <Link
              to="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg border border-orange-500/30 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Abonnements</span>
            </Link>
          </div>
        </div>
      </header>

      {/* AI Assistant Modal */}
      {isAiOpen && <AIAssistantModal onClose={() => setIsAiOpen(false)} />}
    </>
  );
}
