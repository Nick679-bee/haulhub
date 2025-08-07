import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService, Haul, CreateHaulRequest } from '@/lib/api';

export interface HaulsState {
  hauls: Haul[];
  currentHaul: Haul | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  filters: {
    filter?: 'active' | 'completed' | 'pending' | 'my_hauls' | 'my_assignments';
    page: number;
    per_page: number;
  };
}

const initialState: HaulsState = {
  hauls: [],
  currentHaul: null,
  isLoading: false,
  error: null,
  total: 0,
  filters: {
    page: 1,
    per_page: 10,
  },
};

// Async thunks
export const fetchHauls = createAsyncThunk(
  'hauls/fetchHauls',
  async (params?: {
    filter?: 'active' | 'completed' | 'pending' | 'my_hauls' | 'my_assignments';
    page?: number;
    per_page?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.getHauls(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch hauls');
    }
  }
);

export const fetchHaul = createAsyncThunk(
  'hauls/fetchHaul',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.getHaul(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch haul');
    }
  }
);

export const createHaul = createAsyncThunk(
  'hauls/createHaul',
  async (haulData: CreateHaulRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createHaul(haulData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create haul');
    }
  }
);

export const updateHaul = createAsyncThunk(
  'hauls/updateHaul',
  async ({ id, haulData }: { id: number; haulData: Partial<CreateHaulRequest> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateHaul(id, haulData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update haul');
    }
  }
);

export const deleteHaul = createAsyncThunk(
  'hauls/deleteHaul',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiService.deleteHaul(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete haul');
    }
  }
);

export const assignHaul = createAsyncThunk(
  'hauls/assignHaul',
  async ({ id, driverId }: { id: number; driverId: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.assignHaul(id, driverId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign haul');
    }
  }
);

export const startHaul = createAsyncThunk(
  'hauls/startHaul',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.startHaul(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start haul');
    }
  }
);

export const completeHaul = createAsyncThunk(
  'hauls/completeHaul',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.completeHaul(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete haul');
    }
  }
);

export const cancelHaul = createAsyncThunk(
  'hauls/cancelHaul',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.cancelHaul(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel haul');
    }
  }
);

const haulsSlice = createSlice({
  name: 'hauls',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentHaul: (state, action: PayloadAction<Haul | null>) => {
      state.currentHaul = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<HaulsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearHauls: (state) => {
      state.hauls = [];
      state.currentHaul = null;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch hauls
    builder
      .addCase(fetchHauls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHauls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hauls = action.payload!.hauls;
        state.total = action.payload!.total;
        state.error = null;
      })
      .addCase(fetchHauls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single haul
    builder
      .addCase(fetchHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentHaul = action.payload!.haul;
        state.error = null;
      })
      .addCase(fetchHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create haul
    builder
      .addCase(createHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hauls.unshift(action.payload!.haul);
        state.total += 1;
        state.error = null;
      })
      .addCase(createHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update haul
    builder
      .addCase(updateHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHaul = action.payload!.haul;
        const index = state.hauls.findIndex(h => h.id === updatedHaul.id);
        if (index !== -1) {
          state.hauls[index] = updatedHaul;
        }
        if (state.currentHaul?.id === updatedHaul.id) {
          state.currentHaul = updatedHaul;
        }
        state.error = null;
      })
      .addCase(updateHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete haul
    builder
      .addCase(deleteHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload as number;
        state.hauls = state.hauls.filter(h => h.id !== deletedId);
        if (state.currentHaul?.id === deletedId) {
          state.currentHaul = null;
        }
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign haul
    builder
      .addCase(assignHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHaul = action.payload!.haul;
        const index = state.hauls.findIndex(h => h.id === updatedHaul.id);
        if (index !== -1) {
          state.hauls[index] = updatedHaul;
        }
        if (state.currentHaul?.id === updatedHaul.id) {
          state.currentHaul = updatedHaul;
        }
        state.error = null;
      })
      .addCase(assignHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Start haul
    builder
      .addCase(startHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHaul = action.payload!.haul;
        const index = state.hauls.findIndex(h => h.id === updatedHaul.id);
        if (index !== -1) {
          state.hauls[index] = updatedHaul;
        }
        if (state.currentHaul?.id === updatedHaul.id) {
          state.currentHaul = updatedHaul;
        }
        state.error = null;
      })
      .addCase(startHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete haul
    builder
      .addCase(completeHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHaul = action.payload!.haul;
        const index = state.hauls.findIndex(h => h.id === updatedHaul.id);
        if (index !== -1) {
          state.hauls[index] = updatedHaul;
        }
        if (state.currentHaul?.id === updatedHaul.id) {
          state.currentHaul = updatedHaul;
        }
        state.error = null;
      })
      .addCase(completeHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel haul
    builder
      .addCase(cancelHaul.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelHaul.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHaul = action.payload!.haul;
        const index = state.hauls.findIndex(h => h.id === updatedHaul.id);
        if (index !== -1) {
          state.hauls[index] = updatedHaul;
        }
        if (state.currentHaul?.id === updatedHaul.id) {
          state.currentHaul = updatedHaul;
        }
        state.error = null;
      })
      .addCase(cancelHaul.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentHaul, setFilters, clearHauls } = haulsSlice.actions;
export default haulsSlice.reducer;

