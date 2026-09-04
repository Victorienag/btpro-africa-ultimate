import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { calculateTakeoff, computeQuotation } from '../services/calculationEngine';
import { generateArchitecturalPlans } from '../services/svgPlanGenerator';
import { DEFAULT_PRICE_LISTS } from '../../server/db';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

const INITIAL_PROJECTS = [
  {
    id: 'proj-villa-1',
    name: 'Villa Moderne 3 Chambres + Salon',
    type: 'Maison',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    length: 15,
    width: 12,
    floors: 1,
    budget: 18000000,
    deadline_weeks: 16,
    spaces: [
      { name: 'Salon', quantity: 1, minArea: 18 },
      { name: 'Cuisine', quantity: 1, minArea: 8 },
      { name: 'Terrasse', quantity: 1, minArea: 6 },
      { name: 'Chambre', quantity: 3, minArea: 9 },
      { name: 'Douche', quantity: 2, minArea: 3.5 },
      { name: 'Garage', quantity: 1, minArea: 15 },
      { name: 'Bureau', quantity: 0, minArea: 9 }
    ],
    tasks: [
      { id: 't-1', name: 'Terrassement & Fouilles en rigole', weeks: '1-2', duration_weeks: 2, progress: 100, status: 'completed' },
      { id: 't-2', name: 'Béton de propreté & Fondations semelles', weeks: '3-4', duration_weeks: 2, progress: 100, status: 'completed' },
      { id: 't-3', name: 'Élévation des murs en agglos de 15', weeks: '5-8', duration_weeks: 4, progress: 65, status: 'in_progress' },
      { id: 't-4', name: 'Coulage Dalle de Compression / Chaînage', weeks: '9-10', duration_weeks: 2, progress: 0, status: 'pending' },
      { id: 't-5', name: 'Charpente & Pose Tôles Bac Alu 5/10e', weeks: '11-12', duration_weeks: 2, progress: 0, status: 'pending' },
      { id: 't-6', name: 'Plomberie, Électricité & Enduits', weeks: '13-14', duration_weeks: 2, progress: 0, status: 'pending' },
      { id: 't-7', name: 'Carrelage, Peinture & Réception', weeks: '15-16', duration_weeks: 2, progress: 0, status: 'pending' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'proj-hotel-1',
    name: 'Hôtel Résidence 10 Chambres + Réception',
    type: 'Hôtel',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    length: 30,
    width: 20,
    floors: 2,
    budget: 85000000,
    deadline_weeks: 32,
    spaces: [
      { name: 'Réception', quantity: 1, minArea: 25 },
      { name: 'Chambre Hôtel', quantity: 10, minArea: 20 },
      { name: 'Restaurant', quantity: 1, minArea: 35 },
      { name: 'Cuisine Pro', quantity: 1, minArea: 15 },
      { name: 'Salle Conférence', quantity: 1, minArea: 40 },
      { name: 'Piscine', quantity: 1, minArea: 30 },
      { name: 'Parking', quantity: 5, minArea: 15 }
    ],
    tasks: [
      { id: 'th-1', name: 'Implantation & Fondations profondes', weeks: '1-6', duration_weeks: 6, progress: 100, status: 'completed' },
      { id: 'th-2', name: 'Gros Œuvre RDC & R+1', weeks: '7-18', duration_weeks: 12, progress: 40, status: 'in_progress' },
      { id: 'th-3', name: 'Étanchéité & Climatisation VRV', weeks: '19-24', duration_weeks: 6, progress: 0, status: 'pending' },
      { id: 'th-4', name: 'Agencement, Mobilier & Finitions', weeks: '25-32', duration_weeks: 8, progress: 0, status: 'pending' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'proj-bureau-1',
    name: 'Bâtiment Bureaux Open Space & Direction',
    type: 'Bureau',
    country: 'Sénégal',
    city: 'Dakar',
    length: 20,
    width: 15,
    floors: 1,
    budget: 40000000,
    deadline_weeks: 20,
    spaces: [
      { name: 'Open Space', quantity: 1, minArea: 50 },
      { name: 'Bureau Direction', quantity: 3, minArea: 12 },
      { name: 'Salle Réunion', quantity: 1, minArea: 20 },
      { name: 'Sanitaires H/F', quantity: 2, minArea: 8 },
      { name: 'Salle Serveur', quantity: 1, minArea: 6 },
      { name: 'Parking', quantity: 4, minArea: 15 }
    ],
    tasks: [
      { id: 'tb-1', name: 'Gros Œuvre & Fondations', weeks: '1-8', duration_weeks: 8, progress: 80, status: 'in_progress' },
      { id: 'tb-2', name: 'Câblage IT & Climatisation', weeks: '9-14', duration_weeks: 6, progress: 0, status: 'pending' },
      { id: 'tb-3', name: 'Faux Plafonds & Mobilier', weeks: '15-20', duration_weeks: 6, progress: 0, status: 'pending' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'proj-route-1',
    name: 'Aménagement Voirie Bitumée 100m + Caniveaux',
    type: 'Route',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    length: 100, // length in meters
    width: 7.0, // road width 2 lanes
    floors: 1,
    budget: 25000000,
    deadline_weeks: 12,
    spaces: [
      { name: 'Chaussée Bitume', quantity: 1 },
      { name: 'Caniveau BA 60x60', quantity: 2 },
      { name: 'Bordures T2', quantity: 2 }
    ],
    tasks: [
      { id: 'tr-1', name: 'Décapage & Terrassement Déblai/Remblai', weeks: '1-3', duration_weeks: 3, progress: 100, status: 'completed' },
      { id: 'tr-2', name: 'Pose Caniveaux BA & Évacuations', weeks: '4-6', duration_weeks: 3, progress: 50, status: 'in_progress' },
      { id: 'tr-3', name: 'Couche de fondation latérite compactée', weeks: '7-9', duration_weeks: 3, progress: 0, status: 'pending' },
      { id: 'tr-4', name: 'Application Enrobé Bitume & Signalisation', weeks: '10-12', duration_weeks: 3, progress: 0, status: 'pending' }
    ],
    created_at: new Date().toISOString()
  }
];

export function ProjectProvider({ children }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('btpro_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return projects[0]?.id || 'proj-villa-1';
  });

  // Global Price Lists (Admin managed)
  const [priceLists, setPriceLists] = useState(() => {
    const saved = localStorage.getItem('btpro_price_lists');
    return saved ? JSON.parse(saved) : DEFAULT_PRICE_LISTS;
  });

  // User Custom Prices ("Mes Prix")
  const [userPrices, setUserPrices] = useState(() => {
    const saved = localStorage.getItem('btpro_user_prices');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('btpro_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('btpro_price_lists', JSON.stringify(priceLists));
  }, [priceLists]);

  useEffect(() => {
    localStorage.setItem('btpro_user_prices', JSON.stringify(userPrices));
  }, [userPrices]);

  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Real-time Takeoff & Quotation Calculation
  const takeoff = useMemo(() => {
    if (!activeProject) return { items: [] };
    return calculateTakeoff(activeProject);
  }, [activeProject]);

  const quotation = useMemo(() => {
    if (!takeoff || !activeProject) return { lines: [], subtotalMaterials: 0, subtotalLabor: 0, totalHT: 0, totalTTC: 0, tva: 0 };
    return computeQuotation(takeoff, priceLists, userPrices.filter(p => p.user_id === user?.id || !p.user_id));
  }, [takeoff, priceLists, userPrices, activeProject, user]);

  // Real-time Architectural SVG Plans
  const plans = useMemo(() => {
    if (!activeProject) return {};
    return generateArchitecturalPlans(activeProject);
  }, [activeProject]);

  // Project Actions
  const createProject = (newProjectData) => {
    const id = `proj-${Date.now()}`;
    const fullProject = {
      id,
      name: newProjectData.name || `Nouveau Projet ${newProjectData.type}`,
      type: newProjectData.type || 'Maison',
      country: newProjectData.country || 'Côte d\'Ivoire',
      city: newProjectData.city || 'Abidjan',
      length: Number(newProjectData.length) || 20,
      width: Number(newProjectData.width) || 15,
      floors: Number(newProjectData.floors) || 1,
      budget: Number(newProjectData.budget) || 15000000,
      deadline_weeks: Number(newProjectData.deadline_weeks) || 16,
      spaces: newProjectData.spaces || [
        { name: 'Salon', quantity: 1, minArea: 18 },
        { name: 'Cuisine', quantity: 1, minArea: 8 },
        { name: 'Chambre', quantity: 3, minArea: 9 },
        { name: 'Douche', quantity: 2, minArea: 3.5 }
      ],
      tasks: [
        { id: `t-${Date.now()}-1`, name: 'Terrassement & Fondations', weeks: '1-4', duration_weeks: 4, progress: 0, status: 'pending' },
        { id: `t-${Date.now()}-2`, name: 'Élévation des murs & Dalle', weeks: '5-10', duration_weeks: 6, progress: 0, status: 'pending' },
        { id: `t-${Date.now()}-3`, name: 'Charpente & Toiture', weeks: '11-13', duration_weeks: 3, progress: 0, status: 'pending' },
        { id: `t-${Date.now()}-4`, name: 'Finitions & Réception', weeks: '14-16', duration_weeks: 3, progress: 0, status: 'pending' }
      ],
      created_at: new Date().toISOString()
    };

    setProjects(prev => [fullProject, ...prev]);
    setActiveProjectId(id);
    return fullProject;
  };

  const updateActiveProject = (updates) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates } : p));
  };

  const updateTaskProgress = (taskId, newProgress) => {
    if (!activeProject) return;
    const updatedTasks = activeProject.tasks.map(t => {
      if (t.id === taskId) {
        const progress = Math.min(100, Math.max(0, Number(newProgress)));
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';
        return { ...t, progress, status };
      }
      return t;
    });
    updateActiveProject({ tasks: updatedTasks });
  };

  // Price List Management (Admin)
  const updatePriceItem = (id, newPrice) => {
    setPriceLists(prev => prev.map(item => item.id === id ? { ...item, price: Number(newPrice) } : item));
  };

  // User Custom Price Override ("Mes Prix")
  const setCustomPrice = (material, price) => {
    const existingIndex = userPrices.findIndex(p => p.material?.toLowerCase() === material?.toLowerCase() && (p.user_id === user?.id || !p.user_id));
    if (existingIndex >= 0) {
      const copy = [...userPrices];
      copy[existingIndex].price = Number(price);
      setUserPrices(copy);
    } else {
      setUserPrices(prev => [...prev, {
        id: `mp-${Date.now()}`,
        user_id: user?.id,
        material,
        price: Number(price)
      }]);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      activeProjectId,
      setActiveProjectId,
      createProject,
      updateActiveProject,
      updateTaskProgress,
      takeoff,
      quotation,
      plans,
      priceLists,
      updatePriceItem,
      userPrices,
      setCustomPrice
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
