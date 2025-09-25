'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchPolls, setFilters } from '@/lib/slices/pollsSlice';
import PollCard from '@/components/PollCard';
import Link from 'next/link';

export default function PollsPage() {
  const { polls, isLoading, filters, hasMore } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [ordering, setOrdering] = useState(filters.ordering || '-created_at');

  useEffect(() => {
    dispatch(fetchPolls(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ 
      search: searchTerm, 
      status: "active", 
      ordering,
      page: 1 
    }));
  };

  const handleLoadMore = () => {
    dispatch(setFilters({ 
      ...filters, 
      page: (filters.page || 1) + 1 
    }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setOrdering('-created_at');
    dispatch(setFilters({ 
      search: '', 
      status: 'active', 
      ordering: '-created_at',
      page: 1 
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Polls</h1>
        {user && (
          <Link
            href="/polls/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Poll
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search polls..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value as "created_at" | "total_votes" | "-total_votes")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-total_votes">Most Votes</option>
                <option value="total_votes">Fewest Votes</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Polls List */}
      {isLoading && polls.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading polls...</p>
        </div>
      ) : polls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No polls found matching your criteria.</p>
          <button
            onClick={handleReset}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Clear filters
          </button>
        </div> 
      )}
    </div>
  );
}