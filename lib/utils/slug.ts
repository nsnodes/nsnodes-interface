/**
 * Utility functions for converting society names to URL-safe slugs
 */

import type { SocietyDatabase } from '@/lib/data/societies-database';

/**
 * Convert society name to URL-safe slug
 * "Próspera" -> "prospera"
 * "The Network School" -> "network-school"
 */
export function societyNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/^the\s+/i, '') // Remove "The" prefix
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Find a society by its URL slug
 * Returns the society if found, null otherwise
 */
export function findSocietyBySlug(
  slug: string,
  societies: SocietyDatabase[]
): SocietyDatabase | null {
  return societies.find(s => societyNameToSlug(s.name) === slug) || null;
}
