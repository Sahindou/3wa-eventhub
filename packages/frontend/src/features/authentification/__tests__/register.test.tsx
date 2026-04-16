import '@testing-library/jest-dom'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { RegisterPage } from '../ui/pages/RegisterPage'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { createTestStore } from '../../../modules/testing/tests-environment'
import type { AppStore } from '../../../modules/store/store'
import type { AuthApi } from '../../../modules/api/authApi'

describe('Register page', () => {
  let store: AppStore
  let mockAuthApi: { login: jest.Mock; register: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthApi = {
      login: jest.fn(),
      register: jest.fn(),
    }
    store = createTestStore({
      dependencies: { authApi: mockAuthApi as unknown as AuthApi },
    })
  })

  const setup = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>,
    )
  }

  it('should display all inputs', () => {
    setup()

    const username = screen.getByPlaceholderText('Enter your username')
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    expect(username).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
  })

  it('should keep button disabled when form is incomplete', async () => {
    setup()

    const btn = screen.getByRole('button', { name: 'Sign up' })
    const email = screen.getByPlaceholderText('Enter your email')

    expect(btn).toBeDisabled()

    await userEvent.type(email, 'test@eventhub.com')

    // Le bouton doit rester désactivé car username et password sont vides
    expect(btn).toBeDisabled()
  })

  it('should enable button when all fields are filled', async () => {
    setup()

    const btn = screen.getByRole('button', { name: 'Sign up' })
    expect(btn).toBeDisabled()

    const username = screen.getByPlaceholderText('Enter your username')
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(username, 'Testeur')
    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'Testeur123@')

    await waitFor(() => {
      expect(btn).toBeEnabled()
    })
  })

  it('should dispatch registerUser action on form submit', async () => {
    // Mock de l'API qui retourne un utilisateur créé
    mockAuthApi.register.mockResolvedValue({
      token: 'fake-jwt-token',
      user: {
        id: 'generated-id',
        username: 'Testeur',
        email: 'test@eventhub.com',
      },
    })

    setup()

    const username = screen.getByPlaceholderText('Enter your username')
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(username, 'Testeur')
    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'Testeur123@')

    const form = email.closest('form')
    fireEvent.submit(form!)

    // Vérifier que l'action a été dispatchée en vérifiant l'état du store
    await waitFor(() => {
      const state = store.getState()
      // Pendant le chargement
      expect(state.auth.isLoading).toBe(true)
    })

    // Attendre la fin du thunk
    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.isLoading).toBe(false)
        expect(state.auth.isAuthenticated).toBe(true)
        expect(state.auth.user).toEqual({
          id: expect.any(String),
          username: 'Testeur',
          email: 'test@eventhub.com',
        })
      },
      { timeout: 2000 },
    )

    expect(mockAuthApi.register).toHaveBeenCalledWith('Testeur', 'test@eventhub.com', 'Testeur123@')
  })

  it('should show error for invalid password', async () => {
    setup()

    const username = screen.getByPlaceholderText('Enter your username')
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(username, 'Testeur')
    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'weak')

    const form = email.closest('form')
    fireEvent.submit(form!)

    // Vérifier que l'erreur apparaît dans le store
    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.error).toContain('mot de passe')
        expect(state.auth.isAuthenticated).toBe(false)
      },
      { timeout: 2000 },
    )
  })

  it('should show error for duplicate email', async () => {
    // Mock de l'API qui retourne une erreur de doublon
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: 'Cet email est déjà utilisé' },
        status: 409,
      },
    }
    mockAuthApi.register.mockRejectedValue(axiosError)

    setup()

    const username = screen.getByPlaceholderText('Enter your username')
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(username, 'Testeur')
    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'Testeur123@')

    const form = email.closest('form')
    fireEvent.submit(form!)

    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.error).toBe('Cet email est déjà utilisé')
        expect(state.auth.isAuthenticated).toBe(false)
      },
      { timeout: 2000 },
    )
  })
})
