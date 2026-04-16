import { useEffect } from 'react'
import { useAppDispatch } from '../../modules/store/store'
import { sendAnalyticsEvent } from './send-analytics.action'

export const useTrackPageView = (page: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      sendAnalyticsEvent({
        eventName: 'page_view',
        userId: null,
        page,
      }),
    )
  }, [page, dispatch])
}
