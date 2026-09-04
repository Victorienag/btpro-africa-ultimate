// Smart Meteorological & Site Delay Alert Service for African BTP Projects
export function getSmartSiteAlerts(project, tasks = []) {
  const city = project?.city || 'Abidjan';
  const country = project?.country || 'Côte d\'Ivoire';

  const alerts = [
    {
      id: 'alt-1',
      severity: 'warning',
      title: 'Alerte Météo Mousson & Coulage Dalle',
      message: `Prévision de fortes précipitations tropicales à ${city} (${country}) à J+3. Recommandation : Reporter le coulage de la dalle ou prévoir des bâches étanches polyane 200µ.`,
      task_affected: 'Coulage Dalle Béton Armé',
      action_recommended: 'Sécuriser le ferraillage et drainer les fouilles'
    },
    {
      id: 'alt-2',
      severity: 'info',
      title: 'Optimisation Approvisionnement Ciment',
      message: 'Variation de prix anticipée sur le ciment CPJ 42.5. Il est recommandé de commander le lot de 150 sacs dès cette semaine pour verrouiller le tarif.',
      task_affected: 'Élévation des Murs',
      action_recommended: 'Passer commande via le Catalogue Matériaux BTPRO'
    }
  ];

  // Check if critical path task is delayed
  const delayedTask = tasks.find(t => t.progress < 50 && t.duration_weeks > 2);
  if (delayedTask) {
    alerts.unshift({
      id: 'alt-delay',
      severity: 'danger',
      title: `Retard détecté sur ${delayedTask.name}`,
      message: `La tâche "${delayedTask.name}" accuse un retard estimé de 4 jours. Risque de décalage sur la phase Toiture & Second Œuvre.`,
      task_affected: delayedTask.name,
      action_recommended: 'Renforcer l\'équipe de 2 ouvriers maçons supplémentaires'
    });
  }

  return alerts;
}
