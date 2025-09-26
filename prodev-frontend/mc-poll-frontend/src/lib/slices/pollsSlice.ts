// src/lib/slices/pollsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Poll } from '@/types/poll'; // keep your Poll type

interface PollsState {
  polls: Poll[];
  loading: boolean;
  error: string | null;
}

// Mock fetchPolls API
export const fetchPolls = createAsyncThunk('polls/fetchPolls', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network
  // Return mock data
  return [
    {
      id: '1',
      question: 'What is your favorite color?',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      is_active: true,
      status: 'active',
      total_votes: 42,
      options: [
        { id: 'a', text: 'Red', vote_count: 10 },
        { id: 'b', text: 'Blue', vote_count: 20 },
        { id: 'c', text: 'Green', vote_count: 12 },
      ],
    },
    {
      id: '2',
      question: 'Which frontend framework do you prefer?',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      is_active: true,
      status: 'active',
      total_votes: 30,
      options: [
        { id: 'a', text: 'React', vote_count: 15 },
        { id: 'b', text: 'Vue', vote_count: 10 },
        { id: 'c', text: 'Angular', vote_count: 5 },
      ],
    },
  ] as Poll[];
});

const initialState: PollsState = {
  polls: [],
  loading: false,
  error: null,
};

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action: PayloadAction<Poll[]>) => {
        state.polls = action.payload;
        state.loading = false;
      })
      .addCase(fetchPolls.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch polls';
      });
  },
});

export default pollsSlice.reducer;
