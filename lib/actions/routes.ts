'use server';

import { eventRoutesData, type RouteData } from '@/lib/data/event-routes';

// Password verification for admin access
export async function verifyRoutesAdminPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.ROUTES_ADMIN_PASSWORD || 'admin123';

  if (!correctPassword) {
    console.error('ROUTES_ADMIN_PASSWORD environment variable is not set');
    return false;
  }

  return password.trim() === correctPassword.trim();
}

// Get all route data
export async function getRouteData(): Promise<RouteData> {
  return eventRoutesData;
}

// Note: For now, we're using a static data file
// In production, you would save updates to a database or JSON file
// This is the structure for future implementation:

/*
export async function updateRouteData(data: RouteData): Promise<boolean> {
  try {
    // In production: write to Supabase or JSON file
    // For now: return success (changes will be lost on reload)
    return true;
  } catch (error) {
    console.error('Error updating route data:', error);
    return false;
  }
}
*/
