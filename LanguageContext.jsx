import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    appName: 'BTPRO AFRICA',
    tagline: 'Le SaaS BTP N°1 en Afrique',
    promise: 'En 5 minutes, obtiens Plan 2D + 3D + 4 Façades + Devis + Budget + Planning + Dossier Banque',
    newProject: 'Nouveau Projet',
    myProjects: 'Mes Projets',
    plans: 'Plans 2D/3D',
    estimate: 'Devis & Métré',
    planning: 'Planning Gantt',
    legal: 'Dossier & Juridique',
    marketplace: 'Marketplace BTP',
    myPrices: 'Mes Prix',
    admin: 'Administration',
    login: 'Connexion',
    logout: 'Déconnexion',
    exportPdf: 'Exporter PDF',
    exportDxf: 'Exporter DXF',
    simulateLoan: 'Simulation Bancaire',
    saveChanges: 'Enregistrer les modifications',
  },
  en: {
    appName: 'BTPRO AFRICA',
    tagline: '#1 Construction SaaS in Africa',
    promise: 'In 5 minutes, generate 2D + 3D Plans + 4 Elevations + Bill of Quantities + Gantt + Bank Dossier',
    newProject: 'New Project',
    myProjects: 'My Projects',
    plans: '2D/3D Plans',
    estimate: 'BoQ & Estimate',
    planning: 'Gantt Schedule',
    legal: 'Bank & Legal Docs',
    marketplace: 'BTP Marketplace',
    myPrices: 'My Custom Prices',
    admin: 'Administration',
    login: 'Login',
    logout: 'Logout',
    exportPdf: 'Export PDF',
    exportDxf: 'Export DXF',
    simulateLoan: 'Bank Loan Simulation',
    saveChanges: 'Save Changes',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('btpro_lang') || 'fr');

  useEffect(() => {
    localStorage.setItem('btpro_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['fr'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
