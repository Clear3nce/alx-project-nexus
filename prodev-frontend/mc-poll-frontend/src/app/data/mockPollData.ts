// app/data/mockPolls.ts
import { Poll } from "@/types/poll";

export const pollsWithData: Poll[] = [
  {
    id: "1",
    question: "What’s your favorite programming language?",
    status: "active",
    is_active: true,
    created_at: "2025-09-01T00:00:00Z",
    expires_at: "2025-12-01T00:00:00Z",
    total_votes: 120,
    options: [
      { id: "1", text: "JavaScript", vote_count: 50 },
      { id: "2", text: "Python", vote_count: 40 },
      { id: "3", text: "TypeScript", vote_count: 30 },
      { id: "4", text: "Go", vote_count: 0 },
    ],
  },
  {
    id: "2",
    question: "Best frontend framework?",
    status: "inactive",
    is_active: false,
    created_at: "2025-08-20T00:00:00Z",
    expires_at: "2025-10-20T00:00:00Z",
    total_votes: 98,
    options: [
      { id: "1", text: "React", vote_count: 50 },
      { id: "2", text: "Vue", vote_count: 30 },
      { id: "3", text: "Angular", vote_count: 18 },
    ],
  },
];

export const pollsEmpty: Poll[] = [];
