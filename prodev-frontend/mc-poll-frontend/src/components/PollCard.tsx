'use client';

import Link from 'next/link';
import { Poll } from '@/types/poll';

interface PollCardProps {
  poll: Poll;
}

export default function PollCard({ poll }: PollCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{poll.question}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            poll.status
          )}`}
        >
          {poll.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          Created: {new Date(poll.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">
          Expires: {new Date(poll.expires_at).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">Total votes: {poll.total_votes}</p>
      </div>

      <div className="space-y-2 mb-4">
        {poll.options.slice(0, 3).map((option) => (
          <div key={option.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{option.text}</span>
            <span className="text-sm font-medium text-blue-600">
              {option.vote_count} votes
            </span>
          </div>
        ))}
        {poll.options.length > 3 && (
          <p className="text-sm text-gray-500">
            +{poll.options.length - 3} more options
          </p>
        )}
      </div>

      <Link
        href={`/polls/${poll.id}`}
        className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition-colors"
      >
        View Poll
      </Link>
    </div>
  );
}