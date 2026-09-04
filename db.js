// Database Store for BTPRO AFRICA (Schema conforming to Supabase / PostgreSQL)
import fs from 'fs';
import path from 'path';

// Base African price list database (Pre-seeded with real market averages)
export const DEFAULT_PRICE_LISTS = [
  // CÔTE D'IVOIRE (Abidjan)
  { id: 'ci-1', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4600 },
  { id: 'ci-2', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Ciment CPJ 32.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4200 },
  { id: 'ci-3', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 320 },
  { id: 'ci-4', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Brique pleine 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 450 },
  { id: 'ci-5', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Sable lagunaire', category: 'Gros Œuvre', unit: 'm3', price: 9500 },
  { id: 'ci-6', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Gravier concassé 15/25', category: 'Gros Œuvre', unit: 'm3', price: 16000 },
  { id: 'ci-7', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 580000 },
  { id: 'ci-8', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Tôles Bac Alu 5/10e', category: 'Toiture', unit: 'm2', price: 5500 },
  { id: 'ci-9', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Carrelage Grès Cérame 60x60', category: 'Finitions', unit: 'm2', price: 7500 },
  { id: 'ci-10', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Peinture Acrylique Extérieure', category: 'Finitions', unit: 'seau 20L', price: 35000 },
  { id: 'ci-11', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Climatiseur Split 1.5 CV', category: 'Équipements Hôtel/Bureau', unit: 'unité', price: 185000 },
  { id: 'ci-12', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Literie & Mobilier Chambre Hôtel', category: 'Équipements Hôtel/Bureau', unit: 'lot', price: 350000 },
  { id: 'ci-13', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Groupe Électrogène 100 kVA', category: 'Équipements Hôtel/Bureau', unit: 'unité', price: 9500000 },
  { id: 'ci-14', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Câblage Réseau RJ45 & Baie', category: 'Équipements Hôtel/Bureau', unit: 'poste', price: 45000 },
  { id: 'ci-15', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Vitrine Verre Trempé 10mm', category: 'Commerce', unit: 'm2', price: 42000 },
  { id: 'ci-16', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Bitume Enrobé à Chaud (Route)', category: 'Voirie & Réseaux', unit: 'tonne', price: 85000 },
  { id: 'ci-17', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Caniveau Béton Armé 60x60', category: 'Voirie & Réseaux', unit: 'ml', price: 18500 },
  { id: 'ci-18', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Bordures T2 Béton', category: 'Voirie & Réseaux', unit: 'ml', price: 6500 },
  { id: 'ci-19', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Maçon Chef d\'équipe', category: 'Main d\'œuvre', unit: 'jour', price: 10000 },
  { id: 'ci-20', country: 'Côte d\'Ivoire', city: 'Abidjan', material: 'Manœuvre / Aide Maçon', category: 'Main d\'œuvre', unit: 'jour', price: 5000 },

  // SÉNÉGAL (Dakar)
  { id: 'sn-1', country: 'Sénégal', city: 'Dakar', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4300 },
  { id: 'sn-2', country: 'Sénégal', city: 'Dakar', material: 'Ciment CPJ 32.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 3900 },
  { id: 'sn-3', country: 'Sénégal', city: 'Dakar', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 350 },
  { id: 'sn-4', country: 'Sénégal', city: 'Dakar', material: 'Sable de dune / carrière', category: 'Gros Œuvre', unit: 'm3', price: 11000 },
  { id: 'sn-5', country: 'Sénégal', city: 'Dakar', material: 'Gravier basalte 15/25', category: 'Gros Œuvre', unit: 'm3', price: 18000 },
  { id: 'sn-6', country: 'Sénégal', city: 'Dakar', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 590000 },
  { id: 'sn-7', country: 'Sénégal', city: 'Dakar', material: 'Bitume Enrobé à Chaud (Route)', category: 'Voirie & Réseaux', unit: 'tonne', price: 88000 },
  { id: 'sn-8', country: 'Sénégal', city: 'Dakar', material: 'Caniveau Béton Armé 60x60', category: 'Voirie & Réseaux', unit: 'ml', price: 19000 },

  // BÉNIN (Cotonou)
  { id: 'bj-1', country: 'Bénin', city: 'Cotonou', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4100 },
  { id: 'bj-2', country: 'Bénin', city: 'Cotonou', material: 'Ciment CPJ 32.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 3800 },
  { id: 'bj-3', country: 'Bénin', city: 'Cotonou', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 290 },
  { id: 'bj-4', country: 'Bénin', city: 'Cotonou', material: 'Sable fluvial', category: 'Gros Œuvre', unit: 'm3', price: 8500 },
  { id: 'bj-5', country: 'Bénin', city: 'Cotonou', material: 'Gravier concassé Dan', category: 'Gros Œuvre', unit: 'm3', price: 17500 },
  { id: 'bj-6', country: 'Bénin', city: 'Cotonou', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 570000 },
  { id: 'bj-7', country: 'Bénin', city: 'Cotonou', material: 'Bitume Enrobé à Chaud (Route)', category: 'Voirie & Réseaux', unit: 'tonne', price: 82000 },
  { id: 'bj-8', country: 'Bénin', city: 'Cotonou', material: 'Caniveau Béton Armé 60x60', category: 'Voirie & Réseaux', unit: 'ml', price: 17000 },

  // TOGO (Lomé)
  { id: 'tg-1', country: 'Togo', city: 'Lomé', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4200 },
  { id: 'tg-2', country: 'Togo', city: 'Lomé', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 300 },
  { id: 'tg-3', country: 'Togo', city: 'Lomé', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 575000 },

  // CAMEROUN (Douala)
  { id: 'cm-1', country: 'Cameroun', city: 'Douala', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 4900 },
  { id: 'cm-2', country: 'Cameroun', city: 'Douala', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 360 },
  { id: 'cm-3', country: 'Cameroun', city: 'Douala', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 610000 },

  // GABON (Libreville)
  { id: 'ga-1', country: 'Gabon', city: 'Libreville', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 5600 },
  { id: 'ga-2', country: 'Gabon', city: 'Libreville', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 480 },
  { id: 'ga-3', country: 'Gabon', city: 'Libreville', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 680000 },

  // MALI (Bamako)
  { id: 'ml-1', country: 'Mali', city: 'Bamako', material: 'Ciment CPJ 42.5 (50kg)', category: 'Gros Œuvre', unit: 'sac', price: 5200 },
  { id: 'ml-2', country: 'Mali', city: 'Bamako', material: 'Brique creuse 15x20x40', category: 'Gros Œuvre', unit: 'unité', price: 350 },
  { id: 'ml-3', country: 'Mali', city: 'Bamako', material: 'Fer à béton HA (Mix 6/8/10/12)', category: 'Gros Œuvre', unit: 'tonne', price: 630000 }
];

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    email: 'admin@btpro.africa',
    password: '123456', // Test credentials
    role: 'ADMIN BTPRO',
    name: 'Directeur Général BTPRO',
    company_name: 'BTPRO Africa Headquarter',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    logo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=120&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-macon',
    email: 'macon@btpro.africa',
    password: '123456',
    role: 'MAÇON/ARTISAN',
    name: 'Kouassi Konan',
    company_name: 'BTP Artisanal Ivoire',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    plan: 'ARTISAN',
    has_active_subscription: true,
    logo_url: '',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-proprio',
    email: 'proprio@btpro.africa',
    password: '123456',
    role: 'PROPRIÉTAIRE',
    name: 'Amadou Diallo',
    company_name: 'Particulier',
    country: 'Sénégal',
    city: 'Dakar',
    plan: 'FREE',
    paid_downloads: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-archi',
    email: 'archi@btpro.africa',
    password: '123456',
    role: 'ARCHITECTE/ENTREPRISE',
    name: 'Cabinet Alpha Architecture',
    company_name: 'Alpha Concept BTP',
    country: 'Bénin',
    city: 'Cotonou',
    plan: 'PRO',
    has_active_subscription: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MARKETPLACE_PROJECTS = [
  {
    id: 'mkt-1',
    client_id: 'user-proprio',
    client_name: 'Amadou Diallo',
    title: 'Construction Villa Duplex 4 Chambres + Piscine',
    type: 'Maison',
    country: 'Sénégal',
    city: 'Dakar - Almadies',
    budget: 45000000,
    deadline_weeks: 24,
    description: 'Recherche entreprise BTP qualifiée pour réalisation clé en main d\'une villa duplex moderne avec salon 40m², suite parentale et piscine.',
    status: 'open',
    bids_count: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'mkt-2',
    client_id: 'user-proprio',
    client_name: 'Société Ivoire Logistique',
    title: 'Entrepôt & Bureaux 600m²',
    type: 'Entrepôt',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan - Vridi',
    budget: 85000000,
    deadline_weeks: 20,
    description: 'Construction d\'un entrepôt métallique avec dalle renforcée pour poids lourds et bloc administratif R+1.',
    status: 'open',
    bids_count: 2,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_MATERIALS_CATALOG = [
  {
    id: 'mat-1',
    name: 'Ciment Dangote 42.5R Haute Résistance',
    supplier: 'Dangote Cement Direct',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    unit: 'Sac 50kg (Min. 50 sacs)',
    price: 4400,
    stock: 5000,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
    commission_rate: 0.02
  },
  {
    id: 'mat-2',
    name: 'Fer à Béton FE E500 HA10 & HA12 Certifié',
    supplier: 'SOTACI Aciéries',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    unit: 'Tonne (Fardeau 2T)',
    price: 570000,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80',
    commission_rate: 0.02
  },
  {
    id: 'mat-3',
    name: 'Pavés Autobloquants Haute Densité 6cm',
    supplier: 'Béton Ivoire Préfabriqué',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    unit: 'm2 (Palette de 12m2)',
    price: 6800,
    stock: 2500,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    commission_rate: 0.02
  }
];
