import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = {
  admin: {
    id: 'user-admin',
    email: 'admin@btpro.africa',
    role: 'ADMIN BTPRO',
    name: 'Directeur Général BTPRO',
    company_name: 'BTPRO Africa Headquarter',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    plan: 'ENTERPRISE',
    has_active_subscription: true,
    paid_downloads: 999
  },
  macon: {
    id: 'user-macon',
    email: 'macon@btpro.africa',
    role: 'MAÇON/ARTISAN',
    name: 'Kouassi Konan',
    company_name: 'BTP Artisanal Ivoire',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    plan: 'ARTISAN',
    has_active_subscription: true,
    paid_downloads: 999
  },
  proprio: {
    id: 'user-proprio',
    email: 'proprio@btpro.africa',
    role: 'PROPRIÉTAIRE',
    name: 'Amadou Diallo',
    company_name: 'Particulier',
    country: 'Sénégal',
    city: 'Dakar',
    plan: 'FREE',
    has_active_subscription: false,
    paid_downloads: 0 // Cannot download unless paid 1000f
  },
  archi: {
    id: 'user-archi',
    email: 'archi@btpro.africa',
    role: 'ARCHITECTE/ENTREPRISE',
    name: 'Cabinet Alpha Concept',
    company_name: 'Alpha Concept BTP',
    country: 'Bénin',
    city: 'Cotonou',
    plan: 'PRO',
    has_active_subscription: true,
    paid_downloads: 999
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('btpro_user');
    return saved ? JSON.parse(saved) : MOCK_USERS.admin; // default to admin for full dev power
  });

  useEffect(() => {
    localStorage.setItem('btpro_user', JSON.stringify(user));
  }, [user]);

  const login = (roleKey = 'admin') => {
    if (MOCK_USERS[roleKey]) {
      setUser(MOCK_USERS[roleKey]);
    }
  };

  const loginWithCustom = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(MOCK_USERS.proprio);
  };

  // Rule verification
  const canDownloadPlan = () => {
    if (user?.role === 'ADMIN BTPRO' || user?.has_active_subscription) return true;
    return (user?.paid_downloads || 0) > 0;
  };

  const consumeDownloadToken = () => {
    if (user?.role !== 'ADMIN BTPRO' && !user?.has_active_subscription) {
      setUser(prev => ({
        ...prev,
        paid_downloads: Math.max(0, (prev.paid_downloads || 0) - 1)
      }));
    }
  };

  const addPaidDownload = () => {
    setUser(prev => ({
      ...prev,
      paid_downloads: (prev.paid_downloads || 0) + 1
    }));
  };

  const activateSubscription = (planName = 'ARTISAN') => {
    setUser(prev => ({
      ...prev,
      plan: planName,
      has_active_subscription: true
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      loginWithCustom,
      logout,
      canDownloadPlan,
      consumeDownloadToken,
      addPaidDownload,
      activateSubscription,
      isAdmin: user?.role === 'ADMIN BTPRO'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
