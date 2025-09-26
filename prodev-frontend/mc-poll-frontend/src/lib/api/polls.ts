// src/lib/api/polls.ts

import { Poll } from '@/types/poll';

export const pollsApi = {
  fetchAll: async (): Promise<{ data: Poll[] }> => {
    const data: Poll[] = [
      {
        id: '1',
        question: 'What is your favorite color?',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        status: 'active',
        total_votes: 120,
        options: [
          { id: '1', text: 'Red', vote_count: 40 },
          { id: '2', text: 'Blue', vote_count: 50 },
          { id: '3', text: 'Green', vote_count: 30 },
        ],
      },
      {
        id: '2',
        question: 'Which framework do you prefer?',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        status: 'active',
        total_votes: 80,
        options: [
          { id: '1', text: 'React', vote_count: 50 },
          { id: '2', text: 'Vue', vote_count: 20 },
          { id: '3', text: 'Angular', vote_count: 10 },
        ],
      },
    ];

    return new Promise((resolve) => setTimeout(() => resolve({ data }), 500));
  },
};
