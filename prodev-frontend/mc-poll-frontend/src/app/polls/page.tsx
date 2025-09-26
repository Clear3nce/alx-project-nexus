'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchPolls } from '@/lib/slices/pollsSlice';
import PollCard from '@/components/PollCard';

export default function PollsPage() {
  const dispatch = useAppDispatch();
  const { polls, loading, error } = useAppSelector((state) => state.polls);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading polls...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
