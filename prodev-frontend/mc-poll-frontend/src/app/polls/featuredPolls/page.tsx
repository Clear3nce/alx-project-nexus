

'use client';

'use client';

import { useState, useEffect } from 'react';
import { Poll, PollsResponse } from '@/types/poll';

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls/');
        
        // First, check if response is OK
        if (!response.ok) {
          // Try to get error message from response
          let errorMessage = `HTTP error! status: ${response.status}`;
          
          try {
            // Try to parse as JSON first
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch (parseError) {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await response.text();
              if (errorText && !errorText.startsWith('<!DOCTYPE')) {
                errorMessage = errorText.substring(0, 200);
              }
            } catch (textError) {
              // If all else fails, use status text
              errorMessage = response.statusText || errorMessage;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // If response is OK, parse the JSON
        const data: PollsResponse = await response.json();
        setPolls(data.results);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // ... rest of your component code (formatDate, getStatusBadge, JSX)

  // ... rest of your component code (keep all the existing JSX)

  // ... rest of your component code (formatDate, getStatusBadge, etc.)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (poll: Poll) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (!poll.is_active || poll.status === 'inactive') {
      return (
        <span className={`${baseClasses} bg-gray-200 text-gray-700`}>
          Inactive
        </span>
      );
    }
    
    const isExpiringSoon = new Date(poll.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    if (isExpiringSoon) {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Ending Soon
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading polls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Error Loading Polls</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Community Polls</h1>
          <p className="text-green-700 text-lg">Share your opinions on various topics</p>
          <div className="mt-4 bg-white rounded-full inline-flex items-center px-4 py-2 shadow-sm">
            <span className="text-green-600 font-medium">
              Total Polls: <span className="text-green-800 font-bold">{polls.length}</span>
            </span>
          </div>
        </div>

        {/* Polls Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100"
            >
              {/* Poll Header */}
              <div className="p-6 border-b border-green-50">
                <div className="flex justify-between items-start mb-3">
                  {getStatusBadge(poll)}
                  <span className="text-sm text-gray-500">
                    {poll.total_votes} votes
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 leading-tight">
                  {poll.question}
                </h3>
              </div>

              {/* Poll Options */}
              <div className="p-6">
                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.total_votes > 0 
                      ? (option.vote_count / poll.total_votes) * 100 
                      : 0;
                    
                    return (
                      <div key={option.id} className="group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-green-800">
                            {option.text}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            {option.vote_count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Poll Footer */}
              <div className="px-6 py-4 bg-green-50 rounded-b-xl">
                <div className="flex justify-between items-center text-sm text-green-700">
                  <span>Expires: {formatDate(poll.expires_at)}</span>
                  <span className="text-xs bg-green-200 px-2 py-1 rounded">
                    Created: {formatDate(poll.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {polls.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-green-900 mb-2">No polls available</h3>
              <p className="text-green-600">Check back later for new polls!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}