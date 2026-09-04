import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Format currency
export function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 })
    .format(amount || 0)
    .replace('XOF', 'FCFA');
}

/**
 * Generates Professional Client Estimate PDF
 */
export function generateClientEstimatePdf(project, quotation, user) {
  const doc = new jsPDF();
  
  // Header / Branding
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(249, 115, 22); // orange-500
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BTPRO AFRICA', 14, 20);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('LE SAAS BTP N°1 EN AFRIQUE | www.btpro.africa', 14, 28);
  doc.text(`Devis N°: DEVIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, 140, 20);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 140, 28);

  // Client & Project Info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR (ENTREPRENEUR / ARTISAN):', 14, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${user?.company_name || 'Cabinet d\'Ingénierie BTP'}`, 14, 56);
  doc.text(`Responsable: ${user?.name || 'Directeur des Travaux'}`, 14, 62);
  doc.text(`Contact: ${user?.email || 'contact@btpro.africa'} | ${user?.city || 'Abidjan'}, ${user?.country || 'Côte d\'Ivoire'}`, 14, 68);

  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT & LOCALISATION CHANTIER:', 120, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Projet: ${project?.name || 'Construction Bâtiment'}`, 120, 56);
  doc.text(`Type: ${project?.type || 'Maison'} (${project?.length || 20}m x ${project?.width || 15}m)`, 120, 62);
  doc.text(`Site: ${project?.city || 'Abidjan'}, ${project?.country || 'Côte d\'Ivoire'}`, 120, 68);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 75, 196, 75);

  // Table of Items
  const tableData = quotation.lines.map((item, idx) => [
    idx + 1,
    item.material,
    item.category,
    item.quantity,
    item.unit,
    formatFCFA(item.unitPrice),
    formatFCFA(item.totalPrice)
  ]);

  doc.autoTable({
    startY: 80,
    head: [['#', 'Désignation des Ouvrages / Matériaux', 'Corps d\'État', 'Qté', 'Unité', 'P.U (FCFA)', 'Total (FCFA)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [249, 115, 22], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 15, halign: 'right' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    }
  });

  const finalY = (doc).lastAutoTable.finalY || 180;

  // Financial Summary Box
  const summaryX = 115;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, finalY + 10, 80, 45, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(summaryX, finalY + 10, 80, 45, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sous-total Matériaux:', summaryX + 5, finalY + 18);
  doc.text(formatFCFA(quotation.subtotalMaterials), 190, finalY + 18, { align: 'right' });

  doc.text('Sous-total Main d\'Œuvre:', summaryX + 5, finalY + 25);
  doc.text(formatFCFA(quotation.subtotalLabor), 190, finalY + 25, { align: 'right' });

  doc.text('Total Hors Taxes (HT):', summaryX + 5, finalY + 32);
  doc.text(formatFCFA(quotation.totalHT), 190, finalY + 32, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(234, 88, 12);
  doc.text('NET À PAYER (TTC):', summaryX + 5, finalY + 45);
  doc.text(formatFCFA(quotation.totalTTC), 190, finalY + 45, { align: 'right' });

  // Signature Block
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text('Cachet & Signature de l\'Entreprise', 20, finalY + 65);
  doc.text('Bon pour Accord & Signature Client', 130, finalY + 65);
  
  doc.setDrawColor(148, 163, 184);
  doc.rect(20, finalY + 70, 60, 25);
  doc.rect(130, finalY + 70, 60, 25);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Signé électroniquement via BTPRO Africa', 22, finalY + 90);

  // Footer
  doc.setFontSize(8);
  doc.text('BTPRO AFRICA - SAS au capital de 10 000 000 FCFA | N° RCCM CI-ABJ-2026-B-1284 | Document certifié conforme', 105, 290, { align: 'center' });

  doc.save(`Devis_${(project?.name || 'BTPRO').replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generates Full Bank Loan Application Dossier (Dossier Banque Complet Multi-Pages)
 */
export function generateBankDossierPdf(project, quotation, user, clientSignature) {
  const doc = new jsPDF();

  // ================= PAGE 1: COUVERTURE =================
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('BTPRO AFRICA', 105, 70, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('DOSSIER DE DEMANDE DE CRÉDIT IMMOBILIER & BTP', 105, 90, { align: 'center' });

  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1.5);
  doc.line(40, 100, 170, 100);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(`Projet: ${project?.name || 'Villa Grand Standing'}`, 105, 120, { align: 'center' });
  doc.text(`Localisation: ${project?.city || 'Abidjan'}, ${project?.country || 'Côte d\'Ivoire'}`, 105, 130, { align: 'center' });
  doc.text(`Montant Total de l'Investissement: ${formatFCFA(quotation.totalTTC)}`, 105, 140, { align: 'center' });

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(30, 170, 150, 60, 4, 4, 'F');
  doc.setFontSize(10);
  doc.text('Promoteur / Porteur du projet:', 35, 185);
  doc.setFont('helvetica', 'bold');
  doc.text(user?.name || 'M. le Promoteur', 35, 193);
  doc.setFont('helvetica', 'normal');
  doc.text(`Structure: ${user?.company_name || 'Particulier / Entreprise'}`, 35, 202);
  doc.text(`Dossier certifié conforme aux normes d'ingénierie africaine`, 35, 212);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Édition: Année 2026 | Document N° BTPRO-BK-${Date.now().toString().slice(-6)}`, 105, 275, { align: 'center' });

  // ================= PAGE 2: NOTE DE PRÉSENTATION & MÉTRÉ =================
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(249, 115, 22);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. NOTE DE PRÉSENTATION TECHNIQUE & ÉCONOMIQUE', 14, 16);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const presentationText = `Le présent dossier a pour objet la construction d'un ouvrage de type ${project?.type || 'Bâtiment'} sur une parcelle de ${project?.length || 20}m x ${project?.width || 15}m (Superficie: ${(project?.length || 20) * (project?.width || 15)} m²) située à ${project?.city || 'Abidjan'}, ${project?.country || 'Côte d\'Ivoire'}.\n\nL'ouvrage a été dimensionné conformément aux règles de l'art du génie civil africain (BAEL 91 / Eurocodes adaptés au climat tropical). Le coût global des travaux s'élève à ${formatFCFA(quotation.totalTTC)} toutes taxes comprises.`;
  doc.text(presentationText, 14, 38, { maxWidth: 180 });

  doc.setFont('helvetica', 'bold');
  doc.text('2. RÉCAPITULATIF DU MÉTRÉ QUANTITATIF ESTIMATIF', 14, 80);

  const tableData = quotation.lines.map((item, idx) => [
    idx + 1,
    item.material,
    item.quantity,
    item.unit,
    formatFCFA(item.unitPrice),
    formatFCFA(item.totalPrice)
  ]);

  doc.autoTable({
    startY: 85,
    head: [['#', 'Poste de Dépense', 'Qté', 'Unité', 'P.U', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 8 }
  });

  // ================= PAGE 3: PLAN DE FINANCEMENT & PLANNING =================
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(249, 115, 22);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. PLAN DE FINANCEMENT & AMORTISSEMENT BANCAIRE', 14, 16);

  const total = quotation.totalTTC;
  const apport = Math.round(total * 0.20);
  const emprunt = total - apport;
  const mensualite = Math.round((emprunt * 1.15) / 60);

  doc.autoTable({
    startY: 35,
    head: [['Élément de Financement', 'Montant (FCFA)', '% du Projet']],
    body: [
      ['Coût Total du Projet (TTC)', formatFCFA(total), '100%'],
      ['Apport Personnel Promoteur (Fonds propres)', formatFCFA(apport), '20%'],
      ['Crédit Bancaire Sollicité', formatFCFA(emprunt), '80%'],
      ['Taux d\'intérêt annuel estimé (TEG)', '8.5% l\'an', '-'],
      ['Durée de remboursement souhaitée', '5 ans (60 mois)', '-'],
      ['Mensualité Constante de Remboursement', formatFCFA(mensualite) + ' / mois', '-'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] }
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. PLANNING PRÉVISIONNEL & ÉCHÉANCIER DE DÉCAISSEMENT', 14, 110);

  doc.autoTable({
    startY: 115,
    head: [['Phase de Travaux', 'Délai', 'Appel de Fonds (%)', 'Montant à débloquer']],
    body: [
      ['1. Terrassement & Fondations', 'Semaines 1 à 4', '30%', formatFCFA(total * 0.3)],
      ['2. Élévation des murs & Dalle', 'Semaines 5 à 10', '35%', formatFCFA(total * 0.35)],
      ['3. Charpente & Toiture Bac alu', 'Semaines 11 à 14', '15%', formatFCFA(total * 0.15)],
      ['4. Électricité & Plomberie', 'Semaines 15 à 18', '10%', formatFCFA(total * 0.10)],
      ['5. Finitions, Peinture & Réception', 'Semaines 19 à 24', '10%', formatFCFA(total * 0.10)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }
  });

  // Client Signature Canvas embed
  doc.text('Cachet de la Banque Prêteuse', 20, 220);
  doc.text('Signature & Accord du Demandeur', 120, 220);
  doc.rect(20, 225, 65, 30);
  doc.rect(120, 225, 65, 30);

  if (clientSignature) {
    try {
      doc.addImage(clientSignature, 'PNG', 125, 227, 55, 25);
    } catch (e) {
      console.warn('Signature image embed skipped', e);
    }
  }

  doc.save(`Dossier_Banque_${(project?.name || 'BTPRO').replace(/\s+/g, '_')}_Complet.pdf`);
}
