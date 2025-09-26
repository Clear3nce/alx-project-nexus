// src/app/polls/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchPolls } from '@/lib/slices/pollsSlice';

export default function PollsPage() {
  const dispatch = useAppDispatch();
  const { polls, loading, error } = useAppSelector((state) => state.polls);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => (
        <div key={poll.id} className="border p-4 rounded">
          <h3 className="font-bold">{poll.question}</h3>
        </div>
      ))}
    </div>
  );
}
