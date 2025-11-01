// Network State Societies Database
// All data is now fetched from Airtable. This file contains only types and helper functions.

export interface SocietyDatabase {
  name: string;
  url: string;
  type: string;
  tier: number;
  x: string;
  discord: string;
  mission: string;
  application: string;
  location?: string;
  icon?: string; // URL to logo image from Airtable
  category?: string; // Category from Airtable (e.g., "Popup City", "Software", "DAO", etc.)
  telegram?: string; // Optional Telegram URL
  founded?: string; // Founding year from Airtable
}

// Empty fallback array (data now comes from Airtable)
export const societiesDatabase: SocietyDatabase[] = [];

// Helper functions for working with the database
export const getSocietiesByType = (type: SocietyDatabase['type']) => {
  return societiesDatabase.filter(society => society.type === type);
};

export const getSocietiesByTier = (tier: SocietyDatabase['tier']) => {
  return societiesDatabase.filter(society => society.tier === tier);
};

export const searchSocieties = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return societiesDatabase.filter(society => 
    society.name.toLowerCase().includes(lowercaseQuery) ||
    society.mission.toLowerCase().includes(lowercaseQuery) ||
    society.url.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDatabaseStats = (societies: SocietyDatabase[] = societiesDatabase) => {
  const total = societies.length;
  const byType = societies.reduce((acc, society) => {
    acc[society.type] = (acc[society.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byTier = societies.reduce((acc, society) => {
    acc[`Tier ${society.tier}`] = (acc[`Tier ${society.tier}`] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byType,
    byTier,
  };
};
