import type { AppDispatch, AppGetState } from '../../../modules/store/store'
import type { Dependencies } from '../../../modules/store/dependencies'
import { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure } from './eventSlice'

export const fetchEvents =
  (page: number, limit = 10) =>
  async (dispatch: AppDispatch, _getState: AppGetState, { dashboardApi }: Dependencies) => {
    dispatch(fetchEventsStart())
    try {
      const response = await dashboardApi.getEvents(page, limit)
      dispatch(fetchEventsSuccess(response.data))
    } catch (error: unknown) {
      dispatch(
        fetchEventsFailure(error instanceof Error ? error.message : 'Erreur lors du chargement'),
      )
    }
  }
