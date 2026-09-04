import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Layers, 
  Calculator, 
  CalendarRange, 
  FileText, 
  Store, 
  Sliders, 
  Bot, 
  ShieldAlert,
  Boxes,
  Home,
  Eye
} from 'lucide-react';

export default function Sidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Tableau de Bord',
      path: '/',
      icon: Home,
      badge: null
    },
    {
      label: 'Nouveau Projet (V2)',
      path: '/new-project',
      icon: PlusCircle,
      badge: 'Générateur'
    },
    {
      label: 'Plans 2D, 3D & Façades',
      path: '/plans',
      icon: Layers,
      badge: 'Mod. A & B'
    },
    {
      label: 'Devis & Métré Quantitatif',
      path: '/estimate',
      icon: Calculator,
      badge: 'Mod. C'
    },
    {
      label: 'Mes Prix (Artisan)',
      path: '/my-prices',
      icon: Sliders,
      badge: 'Override'
    },
    {
      label: 'Planning Gantt & Chantier',
      path: '/planning',
      icon: CalendarRange,
      badge: 'Mod. D'
    },
    {
      label: 'Dossier Banque & Juridique',
      path: '/legal',
      icon: FileText,
      badge: 'Mod. E'
    },
    {
      label: 'Marketplace & Matériaux',
      path: '/marketplace',
      icon: Store,
      badge: 'Mod. F'
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Modules BTP
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Admin Link (Exclusive for Admin or accessible to all in demo mode) */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <div className="px-3 pb-2 text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center justify-between">
            <span>Administration</span>
            <span className="text-[9px] bg-orange-500/20 text-orange-300 px-1 rounded">Mod. H</span>
          </div>

          <NavLink
            to="/admin"
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/admin'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Admin & Prix Pays</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-red-950 text-red-400 border border-red-800">
              Admin
            </span>
          </NavLink>
        </div>
      </div>

      {/* User Info Footprint */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-xs text-white uppercase">
            {user?.name ? user.name.slice(0, 2) : 'BT'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-[10px] text-orange-400 font-mono truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
