"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

// Mock poll data
const mockPolls = [
  {
    id: "22",
    question: "Which framework do you prefer?",
    status: "active",
    created_at: "2025-09-20",
    expires_at: "2025-09-30",
    total_votes: 12,
    options: [
      { id: "opt1", text: "React" },
      { id: "opt2", text: "Vue" },
      { id: "opt3", text: "Angular" }
    ]
  },
  {
    id: "33",
    question: "Which database do you use most?",
    status: "expired",
    created_at: "2025-09-10",
    expires_at: "2025-09-15",
    total_votes: 20,
    options: [
      { id: "opt1", text: "PostgreSQL" },
      { id: "opt2", text: "MySQL" },
      { id: "opt3", text: "MongoDB" }
    ]
  }
];

export default function PollDetailPage() {
  const { id } = useParams(); // get id from URL
  const poll = mockPolls.find((p) => p.id === id); // find poll by id
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  if (!poll) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Poll Not Found</h1>
        <p className="text-gray-600 mb-6">The poll with ID {id} does not exist.</p>
        <Link href="/polls" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Back to Polls
        </Link>
      </div>
    );
  }

  const handleVote = () => {
    if (!selectedOption) return;
    setHasVoted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Link href="/polls" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Polls
        </Link>

        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{poll.question}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              poll.status === "active"
                ? "bg-green-100 text-green-800"
                : poll.status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {poll.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>
            <strong>Created:</strong> {new Date(poll.created_at).toLocaleDateString()}
          </div>
          <div>
            <strong>Expires:</strong> {new Date(poll.expires_at).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Votes:</strong> {poll.total_votes}
          </div>
          <div>
            <strong>Status:</strong> {poll.status}
          </div>
        </div>

        {poll.status === "active" && !hasVoted ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cast Your Vote</h3>
            <div className="space-y-2">
              {poll.options.map((option) => (
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

      {hasVoted || poll.status !== "active" ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-3">Poll Results</h3>
          <ul className="space-y-2">
            {poll.options.map((opt) => (
              <li key={opt.id} className="flex justify-between items-center border p-2 rounded">
                <span>{opt.text}</span>
                <span className="font-bold text-gray-700">X votes</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Results will be visible after you vote or when the poll ends.</p>
        </div>
      )}
    </div>
  );
}
