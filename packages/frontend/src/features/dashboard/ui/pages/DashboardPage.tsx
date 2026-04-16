import { lazy, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppDispatch } from '../../../../modules/store/store'
import { fetchDashboardStats } from '../../store/dashboardThunks'
import { fetchAnalytics } from '../../../analytics/send-analytics.action'
import type { AppState } from '../../../../modules/store/store'

// Lazy loading des charts : Recharts est lourd (~500 KB).
// Ces chunks ne seront téléchargés que quand les données sont prêtes.
const EventsByMonthChart = lazy(() =>
  import('../components/EventsByMonthChart').then((m) => ({
    default: m.EventsByMonthChart,
  })),
)

const EventsByCategoryChart = lazy(() =>
  import('../components/EventsByCategoryChart').then((m) => ({
    default: m.EventsByCategoryChart,
  })),
)

const ChartFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height={250}>
    <CircularProgress size={32} />
  </Box>
)

export const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const { stats, isLoading, error } = useSelector((state: AppState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchAnalytics())
  }, [dispatch])

  const analyticsData = useSelector((state: AppState) => state.analytics.data)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    )
  }

  if (!stats) return null

  const monthlyData = Object.entries(stats.eventsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Tableau de bord
      </Typography>

      {/* ── 4 métriques clés ── */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'Événements créés', value: stats.totalEvents, color: '#6366f1' },
          { label: 'Organisateurs', value: stats.totalOrganizers, color: '#22c55e' },
          { label: 'Événements à venir', value: stats.upcomingEvents, color: '#f59e0b' },
          { label: 'Événements passés', value: stats.pastEvents, color: '#64748b' },
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: metric.color }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── BarChart lazy ── */}
        <Grid item xs={12} md={7}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Événements par mois
              </Typography>
              <Suspense fallback={<ChartFallback />}>
                <EventsByMonthChart data={monthlyData} />
              </Suspense>
            </CardContent>
          </Card>
        </Grid>

        {/* ── PieChart lazy ── */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Par catégorie
              </Typography>
              <Suspense fallback={<ChartFallback />}>
                <EventsByCategoryChart data={stats.eventsByCategory} />
              </Suspense>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Analytics MongoDB : Pages les plus consultées ── */}
        {analyticsData && analyticsData.topPages.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Pages les plus consultées (Analytics MongoDB)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.topPages}>
                    <XAxis dataKey="page" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ── Prochains événements ── */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Prochains événements
              </Typography>
              {stats.nextEvents.length === 0 ? (
                <Typography color="text.secondary">Aucun événement à venir</Typography>
              ) : (
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: '2px solid', borderColor: 'divider' }}>
                      {['Titre', 'Date', 'Capacité', 'Prix'].map((h) => (
                        <Box component="th" key={h} sx={{ p: 1, textAlign: 'left' }}>
                          <Typography variant="body2" fontWeight="bold">
                            {h}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {stats.nextEvents.map((event) => (
                      <Box
                        component="tr"
                        key={event.id}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box component="td" sx={{ p: 1 }}>
                          {event.title}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {new Date(event.startDate).toLocaleDateString('fr-FR')}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {event.capacity}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {event.price} €
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
