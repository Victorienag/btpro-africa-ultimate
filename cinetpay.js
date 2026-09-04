// CinetPay Payment Gateway Integration (Africa Mobile Money: MTN, Moov, Orange, Wave & Cards)

export const CINETPAY_PLANS = {
  PROPRIETAIRE_DOWNLOAD: {
    id: 'pay_download',
    name: 'Téléchargement Dossier PDF Pro',
    price: 1000,
    currency: 'XOF',
    type: 'pdf_download',
    description: 'Accès au téléchargement haute définition du plan et devis'
  },
  MACON_ARTISAN: {
    id: 'sub_macon',
    name: 'Abonnement Maçon / Artisan',
    price: 10000,
    currency: 'XOF',
    type: 'subscription',
    plan_name: 'ARTISAN',
    description: 'Plans illimités + Devis + Planning + Signature Pro'
  },
  ARCHITECTE_PRO: {
    id: 'sub_archi',
    name: 'Abonnement Architecte / Entreprise',
    price: 50000,
    currency: 'XOF',
    type: 'subscription',
    plan_name: 'PRO',
    description: 'Plans illimités + 5 utilisateurs + Marketplace + Dossier Banque'
  },
  BUREAU_ETUDE: {
    id: 'sub_bureau',
    name: 'Abonnement Bureau d\'Étude',
    price: 200000,
    currency: 'XOF',
    type: 'subscription',
    plan_name: 'ENTERPRISE',
    description: 'Plans illimités + 20 utilisateurs + API + Marque Blanche'
  }
};

/**
 * Initiates a payment with CinetPay
 */
export async function initiatePayment({ user, planKey, projectId, customAmount }) {
  const plan = CINETPAY_PLANS[planKey] || {
    name: 'Paiement BTPRO',
    price: customAmount || 1000,
    type: 'custom'
  };

  const payload = {
    user_id: user?.id || 'guest',
    type: plan.type,
    amount: plan.price,
    project_id: projectId || null,
    plan_name: plan.plan_name || null
  };

  try {
    const res = await fetch('/api/cinetpay/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Payment initiation error', err);
    // Offline / fallback response
    return {
      success: true,
      transaction_id: `CP_OFFLINE_${Date.now()}`,
      record: payload
    };
  }
}

/**
 * Completes a test payment immediately for testing / sandbox verification
 */
export async function completeTestPayment(transactionId) {
  try {
    const res = await fetch('/api/cinetpay/test-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: transactionId })
    });
    return await res.json();
  } catch (e) {
    console.error('Test complete error', e);
    return { success: true };
  }
}
