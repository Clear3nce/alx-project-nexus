import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Poll, PollFilters } from '@/types/poll';
import { pollsApi } from '@/lib/api/polls';

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  filters: PollFilters;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  filters: { page: 1 },
  isLoading: false,
  error: null,
  hasMore: true,
};

export const fetchPolls = createAsyncThunk(
  'polls/fetchPolls',
  async (filters: PollFilters, { rejectWithValue }) => {
    try {
      const response = await pollsApi.getPolls(filters);
      return response;
    } catch (error: unknown) {
        if (error instanceof Error){
            return rejectWithValue(error.message || 'Failed to fetch polls');
        }
      return rejectWithValue('Failed to fetch polls');
    }
  }
);

export const fetchPoll = createAsyncThunk(
  'polls/fetchPoll',
  async (id: string, { rejectWithValue }) => {
    try {
      return await pollsApi.getPoll(id);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message || 'Failed to fetch poll');
        }
        return rejectWithValue('Failed to fetch poll');
    }
  }
);

export const voteOnPoll = createAsyncThunk(
  'polls/vote',
  async ({ pollId, optionId, voterId }: { pollId: string; optionId: string; voterId: string }, { rejectWithValue }) => {
    try {
      await pollsApi.vote(pollId, optionId, voterId);
      return await pollsApi.getPollResults(pollId);
    } catch (error: unknown) {
        if (error instanceof Error){
            return rejectWithValue(error.message || 'Failed to vote');
        }
      return rejectWithValue('Failed to vote');
    }
  }
);

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PollFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload.results;
        state.hasMore = !!action.payload.next;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPoll.fulfilled, (state, action) => {
        state.currentPoll = action.payload;
      })
      .addCase(voteOnPoll.fulfilled, (state, action) => {
        state.currentPoll = action.payload;
        // Update the poll in the list if it exists
        const index = state.polls.findIndex(poll => poll.id === action.payload.id);
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
      });
  },
});

export const { setFilters, clearCurrentPoll, clearError } = pollsSlice.actions;
export default pollsSlice.reducer;