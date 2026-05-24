/**
 * Utility functions for matching society names across different formats
 * Handles variations like "Network School" vs "The Network School"
 */

/**
 * Canonical aliases for society names across events, jobs, X accounts, and
 * scraper output. Keep these data-driven so we can add observed variants
 * without changing the matching algorithm.
 */
export const SOCIETY_ALIASES: Record<string, string[]> = {
  'Aleph Crecimiento': ['whabbit', 'alexis', 'alexis | lisk'],
  'Build_Republic': ['angelo', 'build republic', 'build_republic'],
  'Crecimiento': ['matias nisenson', 'paisanos.io', 'paisanos', 'fhenix'],
  'Edge City': ['edgepatagonia', 'edgpatagonia', 'edge city patagonia'],
  'Infinita': ['infinita city'],
  'Ipê City': ['ipê', 'ipe', 'ipe city', 'ipê city', 'gabrielnovak.eth', 'gabrielnovak'],
  'Montelibero': ['ми'],
  'Network School': ['ns', 'ns.com', 'n/s', 'the network school', 'network school malaysia'],
  'OASA': ['tdf', 'traditional dream factory', 'traditional dream factory/oasa'],
  'Próspera': ['prospera', 'prospera global', 'prosperahn', 'próspera'],
};

const toLookupKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/^@/, '')
    .trim();

const NETWORK_STATE_MAPPINGS: Record<string, string> = Object.entries(SOCIETY_ALIASES)
  .reduce((acc, [canonical, aliases]) => {
    acc[toLookupKey(canonical)] = canonical;
    aliases.forEach(alias => {
      acc[toLookupKey(alias)] = canonical;
    });
    return acc;
  }, {} as Record<string, string>);

/**
 * Normalize society name for matching
 * Removes common prefixes and suffixes to improve matching
 * Returns the mapped name with proper capitalization if found in NETWORK_STATE_MAPPINGS
 */
export const normalizeSocietyName = (name: string): string => {
  const lowercased = toLookupKey(name);

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
    .replace(/^@/, '') // Remove X handle prefix
    .trim();

  return NETWORK_STATE_MAPPINGS[toLookupKey(normalized)] ?? normalized;
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


