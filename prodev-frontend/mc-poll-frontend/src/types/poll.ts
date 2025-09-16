export interface Option {
    id: string;
    text: string;
    vote_count: number;
  }
  
  export interface Poll {
    id: string;
    question: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
    status: string;
    options: Option[];
    total_votes: number;
  }
  
  export interface PollFilters {
    search?: string;
    status?: 'active' | 'expired' | 'inactive';
    ordering?: 'created_at' | '-created_at' | 'total_votes' | '-total_votes';
    page?: number;
  }