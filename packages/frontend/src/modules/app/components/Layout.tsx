import { Container, CssBaseline, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrackPageView } from '../../../features/analytics/useTrackPageView'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useTrackPageView(location.pathname)

  return (
    <>
      <CssBaseline />
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EventHub
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color={location.pathname === '/dashboard' ? 'primary' : 'inherit'}
            variant={location.pathname === '/dashboard' ? 'contained' : 'text'}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            color={location.pathname === '/profile' ? 'primary' : 'inherit'}
            variant={location.pathname === '/profile' ? 'contained' : 'text'}
            onClick={() => navigate('/profile')}
          >
            Profil
          </Button>
        </Box>
      </Toolbar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  )
}
