'use client';

import {mockPoll} from "../../data/mockPollData";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchPoll, voteOnPoll, clearCurrentPoll } from '@/lib/slices/pollsSlice';
import PollResults from '@/components/PollResults';
import Link from 'next/link';

export default function PollDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentPoll, isLoading } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [voterId, setVoterId] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPoll(id as string));
    }
    return () => {
      dispatch(clearCurrentPoll());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPoll) {
      // Check if user has already voted
      const storedVote = localStorage.getItem(`poll_${id}_vote`);
      if (storedVote) {
        setHasVoted(true);
        setSelectedOption(storedVote);
      }
      
      // Generate or get voter ID
      let voter = localStorage.getItem('voter_id');
      if (!voter) {
        voter = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('voter_id', voter);
      }
      setVoterId(voter);
    }
  }, [currentPoll, id]);

  const handleVote = async () => {
    if (!selectedOption || !currentPoll) return;

    try {
      await dispatch(voteOnPoll({
        pollId: currentPoll.id,
        optionId: selectedOption,
        voterId: user?.username || voterId
      })).unwrap();

      // Store that this user has voted
      localStorage.setItem(`poll_${id}_vote`, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote. You may have already voted in this poll.');
    }
  };

  if (isLoading && !currentPoll) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading poll...</p>
      </div>
    );
  }

  if (!currentPoll) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Poll Not Found</h1>
        <p className="text-gray-600 mb-6">The poll you are looking for does not exist.</p>
        <Link
          href="/polls"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Polls
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Poll Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Link
          href="/polls"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Back to Polls
        </Link>

        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{currentPoll.question}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentPoll.status === 'active'
                ? 'bg-green-100 text-green-800'
                : currentPoll.status === 'expired'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {currentPoll.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>
            <strong>Created:</strong> {new Date(currentPoll.created_at).toLocaleDateString()}
          </div>
          <div>
            <strong>Expires:</strong> {new Date(currentPoll.expires_at).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Votes:</strong> {currentPoll.total_votes}
          </div>
          <div>
            <strong>Status:</strong> {currentPoll.status}
          </div>
        </div>

        {/* Voting Section */}
        {currentPoll.status === 'active' && !hasVoted ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cast Your Vote</h3>
            <div className="space-y-2">
              {currentPoll.options.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="pollOption"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">{option.text}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={!selectedOption}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Vote
            </button>
          </div>
        ) : hasVoted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">✓ You have already voted in this poll.</p>
            <p className="text-green-600 text-sm mt-1">Thank you for participating!</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800">This poll is no longer active for voting.</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasVoted || currentPoll.status !== 'active' ? (
        <PollResults poll={currentPoll} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Results will be visible after you vote or when the poll ends.</p>
        </div>
      )}
    </div>
  );
}