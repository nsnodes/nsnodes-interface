/**
 * Utility functions for matching society names across different formats
 * Handles variations like "Network School" vs "The Network School"
 */

/**
 * Special mappings for event network states to society names
 * These handle specific cases where event network state names differ from society names
 */
const NETWORK_STATE_MAPPINGS: Record<string, string> = {
  'edgepatagonia': 'Edge City',
  'edgpatagonia': 'Edge City', // Typo variant

  // User/organizer name mappings
  'angelo': 'Build_Republic',
  'gabrielnovak.eth': 'Ipê City',
  'gabrielnovak': 'Ipê City',

  // INFINITA variants - normalize to "Infinita"
  'infinita city': 'Infinita',
  'infinita': 'Infinita',
  'infinita ': 'Infinita', // With trailing space

  // Ipê City variants
  'ipê': 'Ipê City',
  'ipê city': 'Ipê City',

  // Crecimiento variants
  'matias nisenson': 'Crecimiento',
  'paisanos.io': 'Crecimiento',
  'paisanos': 'Crecimiento',
  'fhenix': 'Crecimiento',
  'fhenix ‎': 'Crecimiento', // With invisible character

  // Aleph Crecimiento variants
  'whabbit': 'Aleph Crecimiento',
  'alexis': 'Aleph Crecimiento',
  'alexis | lisk': 'Aleph Crecimiento',

  // Montelibero variants
  'ми': 'Montelibero', // Cyrillic "Mi"
};

/**
 * Normalize society name for matching
 * Removes common prefixes and suffixes to improve matching
 * Returns the mapped name with proper capitalization if found in NETWORK_STATE_MAPPINGS
 */
export const normalizeSocietyName = (name: string): string => {
  const lowercased = name.toLowerCase().trim();

  // Check for special mappings first - these preserve capitalization
  if (NETWORK_STATE_MAPPINGS[lowercased]) {
    return NETWORK_STATE_MAPPINGS[lowercased];
  }

  // For non-mapped names, normalize and return as-is (preserving original case where possible)
  const normalized = name.trim()
    .replace(/^the\s+/i, '') // Remove "The" prefix
    .replace(/\s+community$/i, '') // Remove "Community" suffix
    .replace(/\s+society$/i, '') // Remove "Society" suffix
    .replace(/\s+dao$/i, '') // Remove "DAO" suffix
    .replace(/\s+city$/i, '') // Remove "City" suffix
    .replace(/\.xyz$/i, '') // Remove ".xyz" suffix
    .replace(/\.com$/i, '') // Remove ".com" suffix
    .replace(/\.io$/i, '') // Remove ".io" suffix
    .trim();

  return normalized;
};

/**
 * Check if two society names match (handles variations)
 * Returns true if the names are considered equivalent
 *
 * @example
 * societyNamesMatch("Network School", "The Network School") // true
 * societyNamesMatch("Edge City", "Edge City Patagonia") // true
 * societyNamesMatch("NS", "Network School") // true (acronym match)
 */
export const societyNamesMatch = (name1: string, name2: string): boolean => {
  const normalized1 = normalizeSocietyName(name1);
  const normalized2 = normalizeSocietyName(name2);

  // Case-insensitive comparison
  const lower1 = normalized1.toLowerCase();
  const lower2 = normalized2.toLowerCase();

  // Direct match after normalization
  if (lower1 === lower2) return true;

  // One contains the other
  if (lower1.includes(lower2) || lower2.includes(lower1)) return true;
  
  // Check for common abbreviations
  // e.g., "NS" matches "Network School"
  const words1 = lower1.split(/\s+/);
  const words2 = lower2.split(/\s+/);

  // Check if one is an acronym of the other
  const acronym1 = words1.map(w => w[0]).join('');
  const acronym2 = words2.map(w => w[0]).join('');

  if (lower1 === acronym2 || lower2 === acronym1) return true;
  
  return false;
};

/**
 * Find the best matching society name from a list
 * Returns the society name that best matches the search term
 * 
 * @param searchTerm - The name to search for
 * @param societyNames - List of society names to search through
 * @returns The best matching society name, or null if no match found
 */
export const findMatchingSociety = (
  searchTerm: string,
  societyNames: string[]
): string | null => {
  // First try exact normalized match
  const normalizedSearch = normalizeSocietyName(searchTerm);
  
  for (const name of societyNames) {
    if (normalizeSocietyName(name) === normalizedSearch) {
      return name;
    }
  }
  
  // Then try partial matches
  for (const name of societyNames) {
    if (societyNamesMatch(searchTerm, name)) {
      return name;
    }
  }
  
  return null;
};



