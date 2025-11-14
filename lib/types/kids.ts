// Database representation
export interface DatabaseKidsSubmission {
  id: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  kid1_age: number | null;
  kid2_age: number | null;
  kid3_age: number | null;
  kid4_age: number | null;
  parent1_discord: string;
  parent2_discord: string | null;
  created_at: string; // ISO timestamp
}

// UI representation with Date objects
export interface KidsSubmission {
  id: string;
  startDate: Date;
  endDate: Date;
  kid1Age?: number;
  kid2Age?: number;
  kid3Age?: number;
  kid4Age?: number;
  parent1Discord: string;
  parent2Discord?: string;
  createdAt: Date;
}

// Form input data
export interface KidsSubmissionInput {
  startDate: Date;
  endDate: Date;
  kid1Age?: number;
  kid2Age?: number;
  kid3Age?: number;
  kid4Age?: number;
  parent1Discord: string;
  parent2Discord?: string;
}
