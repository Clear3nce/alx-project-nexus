'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Poll } from '@/types/poll';

interface PollResultsProps {
  poll: Poll;
}

export default function PollResults({ poll }: PollResultsProps) {
  const chartData = poll.options.map(option => ({
    option: option.text,
    votes: option.vote_count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Poll Results</h3>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="option" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#4361ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => (
          <div key={option.id} className="flex justify-between items-center">
            <span className="text-gray-700">{option.text}</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-blue-600">{option.vote_count}</span>
              <span className="text-sm text-gray-500">
                ({poll.total_votes > 0 ? Math.round((option.vote_count / poll.total_votes) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-lg font-semibold text-center">
          Total Votes: {poll.total_votes}
        </p>
      </div>
    </div>
  );
}