import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface EventItem {
  id: string
  title: string
  startDate: string
  endDate: string
  capacity: number
  price: number
  categoryId: string
  organizerId: string
}

interface EventState {
  events: EventItem[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

const initialState: EventState = {
  events: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
}

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchEventsSuccess(
      state,
      action: PayloadAction<{
        data: EventItem[]
        total: number
        page: number
        totalPages: number
      }>,
    ) {
      state.isLoading = false
      state.events = action.payload.data
      state.total = action.payload.total
      state.page = action.payload.page
      state.totalPages = action.payload.totalPages
    },
    fetchEventsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
  },
})

export const { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure, setPage } =
  eventSlice.actions
export const eventReducer = eventSlice.reducer
