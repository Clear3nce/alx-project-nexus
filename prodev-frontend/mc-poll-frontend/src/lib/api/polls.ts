import { Poll, PollFilters } from '@/types/poll';
import { api } from './client';

export const pollsApi = {
  getPolls: (filters: PollFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page.toString());
    
    return api<{ count: number; next: string | null; previous: string | null; results: Poll[] }>(
      `/polls/?${params.toString()}`
    );
  },
  
  getPoll: (id: string) => api<Poll>(`/polls/${id}/`),
  
  getPollResults: (id: string) => api<Poll>(`/polls/${id}/results/`),
  
  vote: (pollId: string, optionId: string, voterId: string) =>
    api(`/polls/${pollId}/vote/`, {
      method: 'POST',
      body: JSON.stringify({ option: optionId, voter_id: voterId }),
    }),
  
  createPoll: (pollData: { question: string; expires_at: string; options: string[] }) =>
    api<Poll>('/polls/', {
      method: 'POST',
      body: JSON.stringify(pollData),
    }),
  
  getActivePolls: () => api<Poll[]>('/polls/active/'),
};