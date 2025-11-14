'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { DatabaseKidsSubmission, KidsSubmission, KidsSubmissionInput } from '@/lib/types/kids';

// Transform database format to UI format
function transformSubmission(dbSubmission: DatabaseKidsSubmission): KidsSubmission {
  return {
    id: dbSubmission.id,
    startDate: new Date(dbSubmission.start_date),
    endDate: new Date(dbSubmission.end_date),
    kid1Age: dbSubmission.kid1_age ?? undefined,
    kid2Age: dbSubmission.kid2_age ?? undefined,
    kid3Age: dbSubmission.kid3_age ?? undefined,
    kid4Age: dbSubmission.kid4_age ?? undefined,
    parent1Discord: dbSubmission.parent1_discord,
    parent2Discord: dbSubmission.parent2_discord ?? undefined,
    createdAt: new Date(dbSubmission.created_at),
  };
}

// Fetch all submissions that are current or future (end_date >= today)
export async function getKidsSubmissions(): Promise<KidsSubmission[]> {
  const supabase = createServerClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const { data, error } = await supabase
    .from('kids_submissions')
    .select('*')
    .gte('end_date', today)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching kids submissions:', error);
    // Provide more helpful error message if table doesn't exist
    if (error.code === '42P01') {
      throw new Error('Database table not found. Please run the migration first.');
    }
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }

  return (data as DatabaseKidsSubmission[]).map(transformSubmission);
}

// Create a new submission
export async function createKidsSubmission(input: KidsSubmissionInput): Promise<KidsSubmission> {
  const supabase = createServerClient();

  // Format dates as YYYY-MM-DD
  const startDate = input.startDate.toISOString().split('T')[0];
  const endDate = input.endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('kids_submissions')
    .insert({
      start_date: startDate,
      end_date: endDate,
      kid1_age: input.kid1Age,
      kid2_age: input.kid2Age ?? null,
      kid3_age: input.kid3Age ?? null,
      kid4_age: input.kid4Age ?? null,
      parent1_discord: input.parent1Discord,
      parent2_discord: input.parent2Discord ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating kids submission:', error);
    // Provide more helpful error message if table doesn't exist
    if (error.code === '42P01') {
      throw new Error('Database table not found. Please run the migration first.');
    }
    throw new Error(`Failed to create submission: ${error.message}`);
  }

  return transformSubmission(data as DatabaseKidsSubmission);
}

// Delete a submission
export async function deleteKidsSubmission(id: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('kids_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting kids submission:', error);
    throw new Error('Failed to delete submission');
  }
}
