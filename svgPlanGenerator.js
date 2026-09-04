// Professional Architectural SVG Generator for BTPRO AFRICA V1.0
// Produces vector architectural plans: Masse, Fondation, Élévation, Élec, Plomberie, Toiture, Route

export function generateArchitecturalPlans(project) {
  const {
    name = 'Projet BTP',
    type = 'Maison',
    length = 20,
    width = 15,
    country = 'Côte d\'Ivoire',
    city = 'Abidjan',
    spaces = []
  } = project;

  const L = Number(length) || 20;
  const W = Number(width) || 15;

  if (type === 'Route') {
    return generateRoutePlans(project);
  }

  // Calculate building layout based on spaces or default African template
  const buildingWidth = Math.min(W - 4, Math.max(8, W * 0.7));
  const buildingLength = Math.min(L - 6, Math.max(10, L * 0.65));
  const offsetX = 3.0; // 3m setback
  const offsetY = 3.0;

  // Generate rooms configuration
  const rooms = generateRoomsLayout(type, spaces, buildingLength, buildingWidth, offsetX, offsetY);

  return {
    masse: generatePlanDeMasseSvg(project, buildingLength, buildingWidth, offsetX, offsetY, rooms),
    fondation: generatePlanFondationSvg(project, buildingLength, buildingWidth, offsetX, offsetY, rooms),
    elevation: generatePlanElevationSvg(project, buildingLength, buildingWidth, offsetX, offsetY, rooms),
    electricite: generatePlanElectriciteSvg(project, buildingLength, buildingWidth, offsetX, offsetY, rooms),
    plomberie: generatePlanPlomberieSvg(project, buildingLength, buildingWidth, offsetX, offsetY, rooms),
    toiture: generatePlanToitureSvg(project, buildingLength, buildingWidth, offsetX, offsetY),
    rooms
  };
}

function generateRoomsLayout(type, spaces, bL, bW, offX, offY) {
  const rooms = [];

  if (type === 'Hôtel') {
    // Hotel Layout: Central corridor (1.6m) + rooms on both sides + reception
    const corridorW = 1.6;
    const receptionH = 4.0;
    
    rooms.push({
      id: 'r-rec',
      name: 'Réception & Hall Accueil',
      x: offX,
      y: offY,
      w: bL,
      h: receptionH,
      color: '#FEF3C7',
      area: (bL * receptionH).toFixed(1)
    });

    const roomW = 4.0;
    const roomH = (bW - receptionH - corridorW) / 2;
    const nbCols = Math.max(2, Math.floor(bL / roomW));

    for (let i = 0; i < nbCols; i++) {
      // Top row rooms
      rooms.push({
        id: `r-h-top-${i}`,
        name: `Chambre Hôtel ${i + 1}`,
        x: offX + (i * roomW),
        y: offY + receptionH,
        w: roomW,
        h: roomH,
        color: '#E0F2FE',
        area: (roomW * roomH).toFixed(1)
      });
      // Bottom row rooms
      rooms.push({
        id: `r-h-bot-${i}`,
        name: `Chambre Hôtel ${i + nbCols + 1}`,
        x: offX + (i * roomW),
        y: offY + receptionH + roomH + corridorW,
        w: roomW,
        h: roomH,
        color: '#E0F2FE',
        area: (roomW * roomH).toFixed(1)
      });
    }
  } else if (type === 'Bureau') {
    // Office Layout: Open Space + Manager Offices + Conference + Server + WCs
    rooms.push({
      id: 'r-open',
      name: 'Open Space Coworking (20 Postes)',
      x: offX,
      y: offY,
      w: bL * 0.6,
      h: bW * 0.65,
      color: '#F1F5F9',
      area: (bL * 0.6 * bW * 0.65).toFixed(1)
    });
    rooms.push({
      id: 'r-dir',
      name: 'Bureau Direction Générale',
      x: offX + (bL * 0.6),
      y: offY,
      w: bL * 0.4,
      h: bW * 0.35,
      color: '#FEF3C7',
      area: (bL * 0.4 * bW * 0.35).toFixed(1)
    });
    rooms.push({
      id: 'r-conf',
      name: 'Salle de Réunion (12p)',
      x: offX + (bL * 0.6),
      y: offY + (bW * 0.35),
      w: bL * 0.4,
      h: bW * 0.3,
      color: '#E0E7FF',
      area: (bL * 0.4 * bW * 0.3).toFixed(1)
    });
    rooms.push({
      id: 'r-san',
      name: 'Bloc Sanitaires H/F (Norme 1/20p)',
      x: offX,
      y: offY + (bW * 0.65),
      w: bL * 0.35,
      h: bW * 0.35,
      color: '#CCFBF1',
      area: (bL * 0.35 * bW * 0.35).toFixed(1)
    });
    rooms.push({
      id: 'r-srv',
      name: 'Local Serveur & Baie IT',
      x: offX + (bL * 0.35),
      y: offY + (bW * 0.65),
      w: bL * 0.25,
      h: bW * 0.35,
      color: '#F3E8FF',
      area: (bL * 0.25 * bW * 0.35).toFixed(1)
    });
    rooms.push({
      id: 'r-caf',
      name: 'Cafétéria & Détente',
      x: offX + (bL * 0.6),
      y: offY + (bW * 0.65),
      w: bL * 0.4,
      h: bW * 0.35,
      color: '#FFEDD5',
      area: (bL * 0.4 * bW * 0.35).toFixed(1)
    });
  } else {
    // Default Residential / Villa Layout
    rooms.push({
      id: 'r-sal',
      name: 'Salon & Salle à Manger',
      x: offX,
      y: offY,
      w: bL * 0.55,
      h: bW * 0.55,
      color: '#FEF3C7',
      area: (bL * 0.55 * bW * 0.55).toFixed(1)
    });
    rooms.push({
      id: 'r-cui',
      name: 'Cuisine Moderne + Cellier',
      x: offX + (bL * 0.55),
      y: offY,
      w: bL * 0.45,
      h: bW * 0.45,
      color: '#FFEDD5',
      area: (bL * 0.45 * bW * 0.45).toFixed(1)
    });
    rooms.push({
      id: 'r-ch-p',
      name: 'Suite Parentale + Dressing + SDB',
      x: offX,
      y: offY + (bW * 0.55),
      w: bL * 0.5,
      h: bW * 0.45,
      color: '#E0F2FE',
      area: (bL * 0.5 * bW * 0.45).toFixed(1)
    });
    rooms.push({
      id: 'r-ch-1',
      name: 'Chambre Enfants 1',
      x: offX + (bL * 0.5),
      y: offY + (bW * 0.45),
      w: bL * 0.3,
      h: bW * 0.35,
      color: '#F1F5F9',
      area: (bL * 0.3 * bW * 0.35).toFixed(1)
    });
    rooms.push({
      id: 'r-ch-2',
      name: 'Chambre Amis 2',
      x: offX + (bL * 0.5),
      y: offY + (bW * 0.8),
      w: bL * 0.3,
      h: bW * 0.2,
      color: '#F1F5F9',
      area: (bL * 0.3 * bW * 0.2).toFixed(1)
    });
    rooms.push({
      id: 'r-sdb',
      name: 'Salle d\'Eau Commune',
      x: offX + (bL * 0.8),
      y: offY + (bW * 0.45),
      w: bL * 0.2,
      h: bW * 0.55,
      color: '#CCFBF1',
      area: (bL * 0.2 * bW * 0.55).toFixed(1)
    });
  }

  return rooms;
}

// 1. PLAN DE MASSE
function generatePlanDeMasseSvg(project, bL, bW, offX, offY, rooms) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  const bx = offX * scale + padding;
  const by = offY * scale + padding;
  const bw = bL * scale;
  const bh = bW * scale;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <!-- CAD Grid -->
    <defs>
      <pattern id="grid" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
        <path d="M ${scale} 0 L 0 0 0 ${scale}" fill="none" stroke="#334155" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#0f172a" />
    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- Cartouche Titre -->
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN DE MASSE & IMPLANTATION</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Projet: ${project.name || 'Bâtiment'} - ${project.city || 'Abidjan'}, ${project.country || 'Côte d\'Ivoire'} | Échelle: 1/100 | Terrain: ${L}m x ${W}m</text>
    </g>

    <!-- Limite Parcelle (Terrain) -->
    <rect x="${padding}" y="${padding}" width="${L * scale}" height="${W * scale}" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8,4" />
    <text x="${padding + 10}" y="${padding - 8}" fill="#f59e0b" font-size="11" font-weight="bold">Limite de Propriété (${L}m x ${W}m - Superficie: ${L * W} m²)</text>

    <!-- Voie d'accès / Rue -->
    <rect x="${padding}" y="${padding + W * scale + 5}" width="${L * scale}" height="25" fill="#1e293b" stroke="#64748b" stroke-width="1" />
    <text x="${padding + (L * scale) / 2}" y="${padding + W * scale + 22}" fill="#94a3b8" font-size="11" text-anchor="middle">VOIE PUBLIQUE PRINCIPALE (EMPRISE 12M)</text>

    <!-- Portail et Clôture -->
    <line x1="${padding + 20}" y1="${padding + W * scale}" x2="${padding + 90}" y2="${padding + W * scale}" stroke="#10b981" stroke-width="4" />
    <text x="${padding + 55}" y="${padding + W * scale - 5}" fill="#10b981" font-size="9" text-anchor="middle">PORTAIL COULISSANT 4.0m</text>

    <!-- Emprise Bâtiment -->
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#334155" stroke="#38bdf8" stroke-width="3" />
    <text x="${bx + bw/2}" y="${by + bh/2}" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">EMPRISE BÂTI RDC (${bL}m x ${bW}m = ${(bL * bW).toFixed(0)} m²)</text>

    <!-- Parking & Espace Vert -->
    <rect x="${padding + 15}" y="${by + 10}" width="${4 * scale}" height="${5 * scale}" fill="#1e3a5f" stroke="#0284c7" stroke-width="1.5" />
    <text x="${padding + 15 + 2 * scale}" y="${by + 10 + 2.5 * scale}" fill="#38bdf8" font-size="10" text-anchor="middle">PARKING (2 VL)</text>

    <!-- Cotations Reculs Réglementaires -->
    <line x1="${padding}" y1="${by}" x2="${bx}" y2="${by}" stroke="#ec4899" stroke-width="1" stroke-dasharray="2,2" />
    <text x="${padding + (bx - padding)/2}" y="${by - 5}" fill="#ec4899" font-size="9" text-anchor="middle">Recul ${offX}m</text>

    <line x1="${bx}" y1="${padding}" x2="${bx}" y2="${by}" stroke="#ec4899" stroke-width="1" stroke-dasharray="2,2" />
    <text x="${bx - 5}" y="${padding + (by - padding)/2}" fill="#ec4899" font-size="9" text-anchor="end">Recul ${offY}m</text>

    <!-- Rose des Vents / Orientation Nord -->
    <g transform="translate(${svgW - 45}, 45)">
      <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/>
      <polygon points="0,-13 4,0 0,2 -4,0" fill="#f97316"/>
      <polygon points="0,13 4,0 0,-2 -4,0" fill="#64748b"/>
      <text x="0" y="-16" fill="#f97316" font-size="9" font-weight="bold" text-anchor="middle">N</text>
    </g>
  </svg>`;
}

// 2. PLAN DE FONDATION
function generatePlanFondationSvg(project, bL, bW, offX, offY, rooms) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  const bx = offX * scale + padding;
  const by = offY * scale + padding;
  const bw = bL * scale;
  const bh = bW * scale;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#0b1329" />
    <!-- Titre -->
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN DE FONDATION & LONGRINES</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Semelles isolées S1 (100x100x30) + Longrines BA 20x40 | Béton dosé à 350 kg/m³ (CPJ 42.5)</text>
    </g>

    <!-- Grille Structurelle & Axes A-B-C / 1-2-3 -->
    <line x1="${bx}" y1="${by - 25}" x2="${bx}" y2="${by + bh + 25}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,3" />
    <circle cx="${bx}" cy="${by - 30}" r="9" fill="#991b1b" />
    <text x="${bx}" y="${by - 27}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">A</text>

    <line x1="${bx + bw/2}" y1="${by - 25}" x2="${bx + bw/2}" y2="${by + bh + 25}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,3" />
    <circle cx="${bx + bw/2}" cy="${by - 30}" r="9" fill="#991b1b" />
    <text x="${bx + bw/2}" y="${by - 27}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">B</text>

    <line x1="${bx + bw}" y1="${by - 25}" x2="${bx + bw}" y2="${by + bh + 25}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,3" />
    <circle cx="${bx + bw}" cy="${by - 30}" r="9" fill="#991b1b" />
    <text x="${bx + bw}" y="${by - 27}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">C</text>

    <!-- Axes Horizontaux -->
    <line x1="${bx - 25}" y1="${by}" x2="${bx + bw + 25}" y2="${by}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,3" />
    <circle cx="${bx - 30}" cy="${by}" r="9" fill="#991b1b" />
    <text x="${bx - 30}" y="${by + 3}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">1</text>

    <line x1="${bx - 25}" y1="${by + bh}" x2="${bx + bw + 25}" y2="${by + bh}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,3" />
    <circle cx="${bx - 30}" cy="${by + bh}" r="9" fill="#991b1b" />
    <text x="${bx - 30}" y="${by + bh + 3}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">2</text>

    <!-- Longrines Périphériques (Béton armé) -->
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#f97316" stroke-width="8" />
    <line x1="${bx + bw/2}" y1="${by}" x2="${bx + bw/2}" y2="${by + bh}" stroke="#f97316" stroke-width="8" />

    <!-- Semelles Isolées (Carrés aux intersections) -->
    ${[
      [bx, by], [bx + bw/2, by], [bx + bw, by],
      [bx, by + bh/2], [bx + bw/2, by + bh/2], [bx + bw, by + bh/2],
      [bx, by + bh], [bx + bw/2, by + bh], [bx + bw, by + bh]
    ].map(([px, py], i) => `
      <rect x="${px - 14}" y="${py - 14}" width="28" height="28" fill="#1e293b" stroke="#eab308" stroke-width="2" />
      <rect x="${px - 5}" y="${py - 5}" width="10" height="10" fill="#ef4444" />
      <text x="${px}" y="${py + 22}" fill="#eab308" font-size="8" text-anchor="middle">S${i+1} (100x100)</text>
    `).join('')}

    <!-- Note Technique -->
    <text x="${bx + bw/2}" y="${by + bh - 20}" fill="#94a3b8" font-size="10" text-anchor="middle">Hérissonage en pierre sèche ép. 15cm + Polyane 150µ + Dalle de forme 10cm</text>
  </svg>`;
}

// 3. PLAN ÉLÉVATION / CLOISONNEMENT (ARCHITECTURE INTÉRIEURE)
function generatePlanElevationSvg(project, bL, bW, offX, offY, rooms) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#0a0f1d" />

    <!-- Titre -->
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN D'ÉLÉVATION & DISTRIBUTION 2D</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Distribution des pièces, cotation intérieure, portes (90x210) & baies vitrées aluminium</text>
    </g>

    <!-- Rooms generation -->
    ${rooms.map(r => {
      const rx = r.x * scale + padding;
      const ry = r.y * scale + padding;
      const rw = r.w * scale;
      const rh = r.h * scale;

      return `
        <!-- Pièce: ${r.name} -->
        <g id="${r.id}">
          <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${r.color}" fill-opacity="0.15" stroke="#38bdf8" stroke-width="3" />
          
          <!-- Nom & Surface -->
          <text x="${rx + rw/2}" y="${ry + rh/2 - 6}" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">${r.name}</text>
          <text x="${rx + rw/2}" y="${ry + rh/2 + 10}" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">S = ${r.area} m²</text>
          
          <!-- Cotation Horizontale -->
          <text x="${rx + rw/2}" y="${ry + 14}" fill="#64748b" font-size="9" text-anchor="middle">${Number(r.w).toFixed(2)}m</text>
          <!-- Cotation Verticale -->
          <text x="${rx + 14}" y="${ry + rh/2}" fill="#64748b" font-size="9" text-anchor="middle" transform="rotate(-90 ${rx + 14} ${ry + rh/2})">${Number(r.h).toFixed(2)}m</text>

          <!-- Porte battante 90cm -->
          <path d="M ${rx + 10} ${ry + rh} A 20 20 0 0 1 ${rx + 30} ${ry + rh - 20}" fill="none" stroke="#eab308" stroke-width="1.5" />
          <line x1="${rx + 10}" y1="${ry + rh}" x2="${rx + 10}" y2="${ry + rh - 20}" stroke="#eab308" stroke-width="2" />

          <!-- Fenêtre 120x120 -->
          <line x1="${rx + rw - 35}" y1="${ry}" x2="${rx + rw - 5}" y2="${ry}" stroke="#ffffff" stroke-width="4" />
          <line x1="${rx + rw - 35}" y1="${ry - 2}" x2="${rx + rw - 5}" y2="${ry - 2}" stroke="#0284c7" stroke-width="1" />
        </g>
      `;
    }).join('')}
  </svg>`;
}

// 4. PLAN ÉLECTRICITÉ
function generatePlanElectriciteSvg(project, bL, bW, offX, offY, rooms) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#090d1a" />
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN ÉLECTRICITÉ & COURANTS FORTS/FAIBLES</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Tableau Général Basse Tension (TGBT), Foyers lumineux LED, Prises 16A 2P+T, Prises RJ45</text>
    </g>

    <!-- Cloisons estompées -->
    ${rooms.map(r => {
      const rx = r.x * scale + padding;
      const ry = r.y * scale + padding;
      const rw = r.w * scale;
      const rh = r.h * scale;

      return `
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="#334155" stroke-width="1.5" />
        <text x="${rx + 8}" y="${ry + 14}" fill="#475569" font-size="8">${r.name}</text>

        <!-- Point Lumineux Centre (Croix + Rond) -->
        <circle cx="${rx + rw/2}" cy="${ry + rh/2}" r="7" fill="#fef08a" fill-opacity="0.3" stroke="#eab308" stroke-width="2" />
        <line x1="${rx + rw/2 - 4}" y1="${ry + rh/2}" x2="${rx + rw/2 + 4}" y2="${ry + rh/2}" stroke="#eab308" stroke-width="1.5"/>
        <line x1="${rx + rw/2}" y1="${ry + rh/2 - 4}" x2="${rx + rw/2}" y2="${ry + rh/2 + 4}" stroke="#eab308" stroke-width="1.5"/>

        <!-- Interrupteur Simple Allumage -->
        <circle cx="${rx + 15}" cy="${ry + rh - 15}" r="4" fill="#38bdf8" />
        <line x1="${rx + 15}" y1="${ry + rh - 15}" x2="${rx + rw/2}" y2="${ry + rh/2}" stroke="#eab308" stroke-width="1" stroke-dasharray="3,3" />

        <!-- Prises 2P+T -->
        <g transform="translate(${rx + rw - 15}, ${ry + rh - 15})">
          <circle cx="0" cy="0" r="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#22c55e" stroke-width="1"/>
        </g>
      `;
    }).join('')}

    <!-- TGBT (Tableau Général) -->
    <rect x="${offX * scale + padding + 10}" y="${offY * scale + padding + 5}" width="20" height="12" fill="#ef4444" stroke="#ffffff" stroke-width="1" />
    <text x="${offX * scale + padding + 35}" y="${offY * scale + padding + 15}" fill="#ef4444" font-size="9" font-weight="bold">TGBT DISJONCTEUR 30mA</text>
  </svg>`;
}

// 5. PLAN PLOMBERIE
function generatePlanPlomberieSvg(project, bL, bW, offX, offY, rooms) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#0a101f" />
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN PLOMBERIE & ÉVACUATIONS SANITAIRES</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Réseau Alimentation Eau Potable (Bleu) + Évacuations EU/EV PVC 100/110 vers Fosse Septique</text>
    </g>

    <!-- Cloisons -->
    ${rooms.map(r => {
      const rx = r.x * scale + padding;
      const ry = r.y * scale + padding;
      const rw = r.w * scale;
      const rh = r.h * scale;
      return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="#334155" stroke-width="1.5" />`;
    }).join('')}

    <!-- Tuyau d'Alimentation Eau Froide (AEP) -->
    <path d="M ${padding + 10} ${svgH - padding} L ${padding + 100} ${svgH - padding} L ${padding + 100} ${padding + 100} L ${svgW - padding - 40} ${padding + 100}" fill="none" stroke="#0284c7" stroke-width="3" />
    <text x="${padding + 110}" y="${padding + 95}" fill="#38bdf8" font-size="9">Arrivée AEP Ø25 Multicouche</text>

    <!-- Fosse Septique Toutes Eaux & Puits Perdu -->
    <g transform="translate(${svgW - padding - 70}, ${svgH - padding - 60})">
      <rect x="0" y="0" width="55" height="35" fill="#334155" stroke="#10b981" stroke-width="2" />
      <text x="27" y="18" fill="#10b981" font-size="8" font-weight="bold" text-anchor="middle">FOSSE SEPTIQUE</text>
      <text x="27" y="28" fill="#94a3b8" font-size="7" text-anchor="middle">3000L BETON</text>

      <circle cx="75" cy="17" r="14" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
      <text x="75" y="20" fill="#f59e0b" font-size="7" text-anchor="middle">PUISARD</text>
    </g>

    <!-- Canalisations Eaux Vannes / Eaux Usées -->
    <path d="M ${offX * scale + padding + 120} ${offY * scale + padding + 80} L ${svgW - padding - 70} ${svgH - padding - 45}" fill="none" stroke="#854d0e" stroke-width="2.5" stroke-dasharray="5,3" />
    <text x="${svgW - padding - 150}" y="${svgH - padding - 60}" fill="#ca8a04" font-size="8">Collecteur PVC Ø110 pente 2%</text>
  </svg>`;
}

// 6. PLAN TOITURE
function generatePlanToitureSvg(project, bL, bW, offX, offY) {
  const scale = 24;
  const padding = 60;
  const L = project.length || 20;
  const W = project.width || 15;
  const svgW = L * scale + padding * 2;
  const svgH = W * scale + padding * 2;

  const bx = offX * scale + padding - 12; // overhang
  const by = offY * scale + padding - 12;
  const bw = bL * scale + 24;
  const bh = bW * scale + 24;

  return `
  <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#0a0f1d" />
    <g transform="translate(15, 20)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PLAN DE TOITURE & CHARPENTE</text>
      <text x="0" y="15" fill="#94a3b8" font-size="10">Toiture Bac Aluminium 5/10e ou Tuiles | Pente 15% avec Débord de toit 50cm</text>
    </g>

    <!-- Contour Toiture avec Débord -->
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#1e293b" stroke="#f97316" stroke-width="3" />

    <!-- Ligne de Faîtage Centrale -->
    <line x1="${bx}" y1="${by + bh/2}" x2="${bx + bw}" y2="${by + bh/2}" stroke="#f97316" stroke-width="4" />
    <text x="${bx + bw/2}" y="${by + bh/2 - 8}" fill="#f97316" font-size="10" font-weight="bold" text-anchor="middle">FAÎTAGE PRINCIPAL</text>

    <!-- Flèches de Pente Pan Nord & Pan Sud -->
    <g transform="translate(${bx + bw/2}, ${by + bh/4})">
      <line x1="0" y1="15" x2="0" y2="-15" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)" />
      <polygon points="0,-15 -4,-5 4,-5" fill="#38bdf8" />
      <text x="10" y="3" fill="#38bdf8" font-size="9">Pente 15% (Vers Gouttière Nord)</text>
    </g>

    <g transform="translate(${bx + bw/2}, ${by + (3 * bh)/4})">
      <polygon points="0,15 -4,5 4,5" fill="#38bdf8" />
      <line x1="0" y1="-15" x2="0" y2="15" stroke="#38bdf8" stroke-width="2" />
      <text x="10" y="3" fill="#38bdf8" font-size="9">Pente 15% (Vers Gouttière Sud)</text>
    </g>

    <!-- Descentes d'eaux pluviales (DEP) aux 4 coins -->
    ${[[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].map(([px, py], idx) => `
      <circle cx="${px}" cy="${py}" r="6" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />
      <text x="${px}" y="${py > by + 50 ? py + 14 : py - 8}" fill="#38bdf8" font-size="8" text-anchor="middle">DEP Ø80</text>
    `).join('')}
  </svg>`;
}

// 7. ROUTE PLANS (Profil en long, profil en travers & tracé)
function generateRoutePlans(project) {
  const length = project.length || 100;
  const width = project.width || 7.0;

  const elevationSvg = `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl font-mono">
    <rect width="100%" height="100%" fill="#0a0f1d" />
    <g transform="translate(20, 25)">
      <text x="0" y="0" fill="#f97316" font-size="14" font-weight="bold">BTPRO AFRICA | PROFIL EN TRAVERS TYPE ROUTIER</text>
      <text x="0" y="18" fill="#94a3b8" font-size="10">Chaussée ${width}m (2 voies) + Accotements 1.5m + Caniveaux BA 60x60</text>
    </g>

    <!-- Coupe Transversale Route -->
    <g transform="translate(100, 160)">
      <!-- Fond de forme terrain naturel -->
      <polygon points="0,150 600,150 600,100 520,100 460,70 140,70 80,100 0,100" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />

      <!-- Couche de fondation latérite 20cm -->
      <polygon points="80,100 520,100 500,80 100,80" fill="#9a3412" opacity="0.8" />
      <text x="300" y="94" fill="#ffffff" font-size="10" text-anchor="middle">Couche de Base Latérite Compactée 20cm</text>

      <!-- Couche de roulement Bitume 5cm -->
      <polygon points="100,80 500,80 490,70 110,70" fill="#0f172a" stroke="#f97316" stroke-width="2" />
      <text x="300" y="77" fill="#f97316" font-size="11" font-weight="bold" text-anchor="middle">Enrobé Bitumineux à Chaud BB 5cm</text>

      <!-- Caniveau Gauche BA 60x60 -->
      <rect x="25" y="70" width="40" height="40" fill="#334155" stroke="#38bdf8" stroke-width="2" />
      <text x="45" y="93" fill="#38bdf8" font-size="7" text-anchor="middle">Caniveau BA</text>

      <!-- Caniveau Droit BA 60x60 -->
      <rect x="535" y="70" width="40" height="40" fill="#334155" stroke="#38bdf8" stroke-width="2" />
      <text x="555" y="93" fill="#38bdf8" font-size="7" text-anchor="middle">Caniveau BA</text>

      <!-- Pente en toit 2.5% -->
      <line x1="300" y1="50" x2="200" y2="55" stroke="#22c55e" stroke-width="1.5" />
      <text x="250" y="45" fill="#22c55e" font-size="9" text-anchor="middle">Pente -2.5%</text>

      <line x1="300" y1="50" x2="400" y2="55" stroke="#22c55e" stroke-width="1.5" />
      <text x="350" y="45" fill="#22c55e" font-size="9" text-anchor="middle">Pente -2.5%</text>
    </g>
  </svg>`;

  return {
    masse: elevationSvg,
    fondation: elevationSvg,
    elevation: elevationSvg,
    electricite: elevationSvg,
    plomberie: elevationSvg,
    toiture: elevationSvg,
    rooms: []
  };
}
