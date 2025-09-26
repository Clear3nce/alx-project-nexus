import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface PollOption {
  id: string;
  text: string;
  vote_count: number;
}

export interface Poll {
  id: string;
  question: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  status: string;
  total_votes: number;
  options: PollOption[];
}

interface PollsState {
  polls: Poll[];
  loading: boolean;
  error: string | null;
}

export const fetchPolls = createAsyncThunk<Poll[]>('polls/fetchPolls', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
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
  ];
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
