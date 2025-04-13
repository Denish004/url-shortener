import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  urls: [],
  totalPages: 1,
  currentPage: 1,
  currentUrl: null,
  analytics: null,
  loading: false,
  error: null,
  success: false,
};

// Create short URL
export const createShortUrl = createAsyncThunk(
  "url/create",
  async (urlData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/urls", urlData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get all URLs
export const getUrls = createAsyncThunk(
  "url/getAll",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/urls?page=${page}&limit=${limit}&search=${search}`
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get URL analytics
export const getAnalytics = createAsyncThunk(
  "url/getAnalytics",
  async (urlId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/urls/${urlId}/analytics`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Delete URL
export const deleteUrl = createAsyncThunk(
  "url/delete",
  async (urlId, { rejectWithValue }) => {
    try {
      await api.delete(`/urls/${urlId}`);
      return urlId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentUrl: (state) => {
      state.currentUrl = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create URL
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentUrl = action.payload;
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get URLs
      .addCase(getUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload.urls;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Analytics
      .addCase(getAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.analytics;
        state.currentUrl = action.payload.url;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete URL
      .addCase(deleteUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.urls = state.urls.filter((url) => url._id !== action.payload);
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentUrl, clearAnalytics } =
  urlSlice.actions;

export default urlSlice.reducer;
