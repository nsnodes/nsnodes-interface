// UI representation of a core commandment
export interface CoreCommandment {
  id: string;
  title: string;
  commandment: string;        // The core principle (one sentence)
  description: string;        // Detailed explanation
  upvotes: number;
  downvotes: number;
  voterNames: string[];       // Anonymous names of voters
  createdAt: Date;
  netVotes: number;           // Computed: upvotes - downvotes
  proposedBy: string;         // .eth name of proposer
}

// Form input for new commandments
export interface CoreCommandmentInput {
  title: string;
  commandment: string;
  description: string;
  submitterName: string;      // Anonymous name
}

// LLM generation request
export interface CoreCommandIdeaRequest {
  mode: 'random' | 'context';
  context?: string;           // User-provided context for generation
  count?: number;             // Number of ideas to generate (default: 1)
}

// LLM writing assistant request
export interface CoreCommandWritingRequest {
  draft: string;
  section: 'title' | 'commandment' | 'description';
  context?: string;
}

// LLM response types
export interface CoreCommandSuggestion {
  title: string;
  commandment: string;
  description: string;
}

export interface CoreCommandWritingImprovement {
  improvedText: string;
  alternatives: string[];
  reason: string;
}
