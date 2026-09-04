// Calculation Engine for BTPRO AFRICA V1.0
// Civil Engineering & Quantity Surveying (Métré & Devis BTP Afrique)

export const AFRICAN_NORMS = {
  Maison: {
    minRoomArea: 9.0, // m2
    minLivingArea: 18.0, // m2
    minCorridorWidth: 1.2, // m
    minCeilingHeight: 2.8, // m
  },
  Hôtel: {
    minRoomArea: 20.0, // m2
    minCorridorWidth: 1.5, // m
    parkingRatio: 0.5, // 1 parking per 2 rooms
  },
  Bureau: {
    minOfficeArea: 9.0, // m2
    wcPerStaff: 20, // 1 WC per 20 staff
    minCorridorWidth: 1.4,
  },
  Commerce: {
    storageMinPercent: 0.20, // Reserve >= 20%
    facadeDisplayRequired: true,
  },
  Route: {
    laneWidthMin: 3.5, // m per lane
    shoulderWidth: 1.5, // m accotement
    drainSection: '60x60',
  }
};

/**
 * Calculates full quantity takeoff (Métré) based on project type, dimensions and spaces
 */
export function calculateTakeoff(project) {
  const { type, length = 20, width = 15, spaces = [], floors = 1 } = project;
  
  if (type === 'Route') {
    const routeLength = Number(length) || 100; // in meters
    const roadWidth = Number(width) || 7.0; // in meters (2 lanes)
    const roadSurface = routeLength * roadWidth; // m2
    
    const deblaiM3 = Math.round(routeLength * roadWidth * 0.45);
    const remblaiM3 = Math.round(routeLength * roadWidth * 0.35);
    const lateriteBaseM3 = Math.round(roadSurface * 0.20);
    const bitumeTonne = Math.round(roadSurface * 0.05 * 2.4); // 5cm thickness, 2.4 t/m3
    const caniveauML = routeLength * 2; // both sides
    const borduresML = routeLength * 2;
    const panneauxCount = Math.max(4, Math.ceil(routeLength / 50));
    
    return {
      isRoute: true,
      roadSurface,
      routeLength,
      roadWidth,
      items: [
        { code: 'ROU-01', material: 'Terrassement Déblai / Décapage', quantity: deblaiM3, unit: 'm3', category: 'Terrassement' },
        { code: 'ROU-02', material: 'Remblai compacté & réglage', quantity: remblaiM3, unit: 'm3', category: 'Terrassement' },
        { code: 'ROU-03', material: 'Couche de fondation en latérite sélectionnée', quantity: lateriteBaseM3, unit: 'm3', category: 'Chaussée' },
        { code: 'ROU-04', material: 'Bitume Enrobé à Chaud (Route)', quantity: bitumeTonne, unit: 'tonne', category: 'Chaussée' },
        { code: 'ROU-05', material: 'Caniveau Béton Armé 60x60', quantity: caniveauML, unit: 'ml', category: 'Assainissement' },
        { code: 'ROU-06', material: 'Bordures T2 Béton', quantity: borduresML, unit: 'ml', category: 'Assainissement' },
        { code: 'ROU-07', material: 'Signalisation verticale & panneaux BTP', quantity: panneauxCount, unit: 'unité', category: 'Signalisation' },
        { code: 'ROU-08', material: 'Maçon Chef d\'équipe', quantity: Math.ceil(routeLength / 5), unit: 'jour', category: 'Main d\'œuvre' },
        { code: 'ROU-09', material: 'Manœuvre / Aide Maçon', quantity: Math.ceil(routeLength / 2), unit: 'jour', category: 'Main d\'œuvre' },
      ]
    };
  }

  // Building Takeoff (Maison, Hôtel, Bureau, Commerce, Clinique, École, Entrepôt)
  const groundArea = (Number(length) || 15) * (Number(width) || 12);
  const totalFloorArea = groundArea * (Number(floors) || 1);
  
  // Calculate total room count & specifics
  const roomCount = spaces.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0) || 6;
  const hotelRooms = spaces.find(s => s.name?.toLowerCase().includes('chambre'))?.quantity || 0;
  const salonCount = spaces.find(s => s.name?.toLowerCase().includes('salon'))?.quantity || 1;
  
  // Concrete, Masonry and Structure calculations
  const wallArea = Math.round((Math.sqrt(groundArea) * 4 * 3.0 + (roomCount * 3.5 * 3.0)) * (Number(floors) || 1));
  const briquesCount = Math.round(wallArea * 12.5 * 1.05); // 12.5 bricks/m2 + 5% breakage
  const betonM3 = Math.round(totalFloorArea * 0.28); // 0.28m3 concrete per m2 built
  const cimentSacs = Math.round(betonM3 * 7 + (wallArea * 0.25)); // 7 bags/m3 concrete + mortar
  const ferHaTonnes = Number(((totalFloorArea * 38) / 1000).toFixed(2)); // ~38kg rebar per m2
  const sableM3 = Math.round(betonM3 * 0.45 + (wallArea * 0.035));
  const gravierM3 = Math.round(betonM3 * 0.85);
  const toitureM2 = Math.round(groundArea * 1.15); // +15% slope & overhang
  const carrelageM2 = Math.round(totalFloorArea * 0.95);
  const peintureSeaux = Math.round((wallArea * 2) / 60); // 60m2 coverage per 20L bucket (2 coats)

  const items = [
    { code: 'BAT-01', material: 'Ciment CPJ 42.5 (50kg)', quantity: cimentSacs, unit: 'sac', category: 'Gros Œuvre' },
    { code: 'BAT-02', material: 'Brique creuse 15x20x40', quantity: briquesCount, unit: 'unité', category: 'Gros Œuvre' },
    { code: 'BAT-03', material: 'Sable lagunaire', quantity: sableM3, unit: 'm3', category: 'Gros Œuvre' },
    { code: 'BAT-04', material: 'Gravier concassé 15/25', quantity: gravierM3, unit: 'm3', category: 'Gros Œuvre' },
    { code: 'BAT-05', material: 'Fer à béton HA (Mix 6/8/10/12)', quantity: Math.max(1, ferHaTonnes), unit: 'tonne', category: 'Gros Œuvre' },
    { code: 'BAT-06', material: 'Tôles Bac Alu 5/10e', quantity: toitureM2, unit: 'm2', category: 'Toiture' },
    { code: 'BAT-07', material: 'Carrelage Grès Cérame 60x60', quantity: carrelageM2, unit: 'm2', category: 'Finitions' },
    { code: 'BAT-08', material: 'Peinture Acrylique Extérieure', quantity: peintureSeaux, unit: 'seau 20L', category: 'Finitions' },
  ];

  // Specific additions by building type
  if (type === 'Hôtel') {
    const rooms = Math.max(4, hotelRooms || 8);
    items.push(
      { code: 'HOT-01', material: 'Climatiseur Split 1.5 CV', quantity: rooms + 2, unit: 'unité', category: 'Équipements Hôtel' },
      { code: 'HOT-02', material: 'Literie & Mobilier Chambre Hôtel', quantity: rooms, unit: 'lot', category: 'Équipements Hôtel' },
      { code: 'HOT-03', material: 'Groupe Électrogène 100 kVA', quantity: 1, unit: 'unité', category: 'Équipements Hôtel' }
    );
  } else if (type === 'Bureau') {
    const desks = Math.max(6, roomCount * 2);
    items.push(
      { code: 'BUR-01', material: 'Câblage Réseau RJ45 & Baie', quantity: desks, unit: 'poste', category: 'Équipements Bureau' },
      { code: 'BUR-02', material: 'Climatiseur Split 1.5 CV', quantity: Math.ceil(desks / 3), unit: 'unité', category: 'Équipements Bureau' }
    );
  } else if (type === 'Commerce') {
    items.push(
      { code: 'COM-01', material: 'Vitrine Verre Trempé 10mm', quantity: Math.round(width * 2.5), unit: 'm2', category: 'Commerce' },
      { code: 'COM-02', material: 'Climatiseur Split 1.5 CV', quantity: 2, unit: 'unité', category: 'Commerce' }
    );
  }

  // Labor / Corps d'état
  const masonDays = Math.round(totalFloorArea * 0.8);
  const helperDays = Math.round(totalFloorArea * 1.5);
  items.push(
    { code: 'MO-01', material: 'Maçon Chef d\'équipe', quantity: masonDays, unit: 'jour', category: 'Main d\'œuvre' },
    { code: 'MO-02', material: 'Manœuvre / Aide Maçon', quantity: helperDays, unit: 'jour', category: 'Main d\'œuvre' }
  );

  return {
    isRoute: false,
    groundArea,
    totalFloorArea,
    wallArea,
    items
  };
}

/**
 * Computes financial quote and applies local price lists & user custom overrides ("Mes Prix")
 */
export function computeQuotation(takeoff, priceList = [], userOverrides = []) {
  const quoteLines = takeoff.items.map(item => {
    // 1. Check user override first
    const userOverride = userOverrides.find(o => 
      o.material?.toLowerCase().trim() === item.material?.toLowerCase().trim()
    );
    
    // 2. Fallback to Country/City base price
    const basePriceItem = priceList.find(p => 
      p.material?.toLowerCase().trim() === item.material?.toLowerCase().trim()
    );

    let unitPrice = 0;
    let priceSource = 'Standard';

    if (userOverride && userOverride.price > 0) {
      unitPrice = Number(userOverride.price);
      priceSource = 'Mes Prix (Personnalisé)';
    } else if (basePriceItem && basePriceItem.price > 0) {
      unitPrice = Number(basePriceItem.price);
      priceSource = `Prix ${basePriceItem.country || 'Local'}`;
    } else {
      // Engineering default fallback
      unitPrice = 5000;
      priceSource = 'Estimation BTP';
    }

    const totalPrice = Math.round(item.quantity * unitPrice);

    return {
      ...item,
      unitPrice,
      totalPrice,
      priceSource
    };
  });

  const subtotalMaterials = quoteLines
    .filter(l => l.category !== 'Main d\'œuvre')
    .reduce((sum, l) => sum + l.totalPrice, 0);

  const subtotalLabor = quoteLines
    .filter(l => l.category === 'Main d\'œuvre')
    .reduce((sum, l) => sum + l.totalPrice, 0);

  const totalHT = subtotalMaterials + subtotalLabor;
  const tva = Math.round(totalHT * 0.18); // 18% TVA UEMOA / CEMAC
  const totalTTC = totalHT + tva;

  // Breakdown by Corps d'État
  const tradeBreakdown = {
    grosOeuvre: Math.round(totalHT * 0.52),
    secondOeuvre: Math.round(totalHT * 0.22),
    finitions: Math.round(totalHT * 0.16),
    honorairesSuivi: Math.round(totalHT * 0.10),
  };

  return {
    lines: quoteLines,
    subtotalMaterials,
    subtotalLabor,
    totalHT,
    tva,
    totalTTC,
    tradeBreakdown
  };
}

/**
 * Calculates Bank Loan monthly repayment: (Total - DownPayment) * 1.15 / Months
 */
export function calculateBankLoan(totalTTC, downPayment = 0, durationMonths = 60) {
  const loanAmount = Math.max(0, totalTTC - downPayment);
  const totalRepayment = loanAmount * 1.15; // 15% bank interest + guarantee cost
  const monthlyPayment = durationMonths > 0 ? Math.round(totalRepayment / durationMonths) : 0;
  
  // Amortization schedule summary
  return {
    loanAmount,
    interestAmount: Math.round(loanAmount * 0.15),
    totalRepayment: Math.round(totalRepayment),
    monthlyPayment,
    durationMonths,
    durationYears: (durationMonths / 12).toFixed(1),
    downPaymentPercent: totalTTC > 0 ? Math.round((downPayment / totalTTC) * 100) : 0
  };
}
