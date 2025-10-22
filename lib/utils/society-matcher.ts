/**
 * Utility functions for matching society names across different formats
 * Handles variations like "Network School" vs "The Network School"
 */

/**
 * Normalize society name for matching
 * Removes common prefixes and suffixes to improve matching
 */
export const normalizeSocietyName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/^the\s+/i, '') // Remove "The" prefix
    .replace(/\s+community$/i, '') // Remove "Community" suffix
    .replace(/\s+society$/i, '') // Remove "Society" suffix
    .replace(/\s+dao$/i, '') // Remove "DAO" suffix
    .replace(/\s+city$/i, '') // Remove "City" suffix
    .replace(/\.xyz$/i, '') // Remove ".xyz" suffix
    .replace(/\.com$/i, '') // Remove ".com" suffix
    .replace(/\.io$/i, '') // Remove ".io" suffix
    .trim();
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
  
  // Direct match after normalization
  if (normalized1 === normalized2) return true;
  
  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Check for common abbreviations
  // e.g., "NS" matches "Network School"
  const words1 = normalized1.split(/\s+/);
  const words2 = normalized2.split(/\s+/);
  
  // Check if one is an acronym of the other
  const acronym1 = words1.map(w => w[0]).join('');
  const acronym2 = words2.map(w => w[0]).join('');
  
  if (normalized1 === acronym2 || normalized2 === acronym1) return true;
  
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

