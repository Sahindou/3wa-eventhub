import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { AppState } from '../../../../modules/store/store'
import { useAppDispatch } from '../../../../modules/store/store'
import { fetchEvents } from '../../store/eventThunks'
import { setPage } from '../../store/eventSlice'
import { Pagination } from '../components/Pagination'

export function EventListPage() {
  const dispatch = useAppDispatch()
  const { events, page, totalPages, isLoading, error } = useSelector(
    (state: AppState) => state.events,
  )

  // Re-fetch quand la page change
  useEffect(() => {
    dispatch(fetchEvents(page))
  }, [dispatch, page])

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
  }

  if (isLoading) return <p>Chargement...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <div>
      <h1>Événements ({events.length} affichés)</h1>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> — {new Date(event.startDate).toLocaleDateString('fr-FR')}
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}
