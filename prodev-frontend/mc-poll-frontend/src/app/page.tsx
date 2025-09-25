'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchPolls } from '@/lib/slices/pollsSlice';
import PollCard from '@/components/PollCard';

// second data.
import { useState } from "react";
import { pollsWithData, pollsEmpty } from "./data/mockPolls";
import { Poll } from "@/types/poll"

export default function Home() {
  //const { polls, isLoading } = useAppSelector((state) => state.polls);
  //const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPolls({ ordering: '-created_at', page: 1 }));
  }, [dispatch]);

  //const featuredPolls = polls.slice(0, 3);



  const [featuredPolls, setFeaturedPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = true; // simulate logged-in user

  useEffect(() => {
    const timer = setTimeout(() => {
      // Toggle between pollsWithData or pollsEmpty to test both scenarios
      setFeaturedPolls(pollsWithData); // change to pollsWithData to show polls
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);




  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">MC Poll System</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create, vote, and analyze polls with our modern polling platform. 
          Get real-time results and insights from your community.
        </p>
        <div className="space-x-4">
          <Link
            href="/polls"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Polls
          </Link>

          
          {user && (
            <Link
              href="/polls/create"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Poll
            </Link>
          )}
        </div>
      </section>

      {/* Featured Polls */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Polls</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading polls...</p>
          </div>
        ) : featuredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No polls available yet.</p>
            {user && (
              <Link
                href="/polls/create"
                className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
              >
                Be the first to create a poll!
              </Link>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/polls"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View All Polls
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose MC Polls?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
            <p className="text-gray-600">
              Watch votes come in live and see instant results with beautiful charts and analytics.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
            <p className="text-gray-600">
              Prevent duplicate votes and ensure the integrity of your polls with our robust system.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Responsive design that works perfectly on desktop, tablet, and mobile devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}