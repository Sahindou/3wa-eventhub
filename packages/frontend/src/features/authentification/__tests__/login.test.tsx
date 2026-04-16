import '@testing-library/jest-dom'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { LoginPage } from '../ui/pages/LoginPage'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createTestStore } from '../../../modules/testing/tests-environment'
import type { AppStore } from '../../../modules/store/store'
import type { AuthApi } from '../../../modules/api/authApi'

describe('Login page', () => {
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
        <LoginPage />
      </Provider>,
    )
  }

  it('should display all inputs', () => {
    setup()
    // vérification de la disponibilité des champs nécessaires
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
  })

  it('should show error for invalid email', async () => {
    setup()

    // récuperation btn
    const btn = screen.getByRole('button', { name: 'Login' })

    expect(btn).toBeDisabled()

    const email = screen.getByPlaceholderText('Enter your email')

    await userEvent.type(email, 'test@eventhub')

    await waitFor(() => {
      expect(btn).toBeDisabled()
    })
  })

  it('should keep button disabled when form is incomplete', async () => {
    setup()
    const btn = screen.getByRole('button', { name: 'Login' })
    const email = screen.getByPlaceholderText('Enter your email')

    await userEvent.type(email, 'test@eventhub.com')

    // Le bouton doit rester désactivé car le password est vide
    expect(btn).toBeDisabled()
  })

  it('should check that everything is filled in before sending', async () => {
    setup()

    // récuperation btn
    const btn = screen.getByRole('button', { name: 'Login' })

    expect(btn).toBeDisabled()

    // vérification de la disponibilité des champs nécessaires
    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'Testeur123@test')

    expect(email).toHaveValue('test@eventhub.com')
    expect(password).toHaveValue('Testeur123@test')

    await waitFor(() => {
      expect(btn).toBeEnabled()
    })
  })

  it('should dispatch loginUser action on form submit', async () => {
    // Mock de l'API qui retourne un utilisateur
    mockAuthApi.login.mockResolvedValue({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        username: 'TestUser',
        email: 'test@eventhub.com',
      },
    })

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    )

    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'Testeur123@test')

    const form = email.closest('form')
    fireEvent.submit(form!)

    // Vérifier que l'action a été dispatchée en vérifiant l'état du store
    await waitFor(() => {
      const state = store.getState()
      expect(state.auth.isLoading).toBe(true)
    })

    // Attendre la fin du thunk
    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.isLoading).toBe(false)
        expect(state.auth.isAuthenticated).toBe(true)
        expect(state.auth.user).toEqual({
          id: '1',
          username: 'TestUser',
          email: 'test@eventhub.com',
        })
      },
      { timeout: 2000 },
    )

    expect(mockAuthApi.login).toHaveBeenCalledWith('test@eventhub.com', 'Testeur123@test')
  })

  it('should show error for invalid credentials', async () => {
    // Mock de l'API qui retourne une erreur
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: 'Email ou mot de passe incorrect' },
        status: 401,
      },
    }
    mockAuthApi.login.mockRejectedValue(axiosError)

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    )

    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(email, 'test@eventhub.com')
    await userEvent.type(password, 'WrongPassword123@')

    const form = email.closest('form')
    fireEvent.submit(form!)

    // Vérifier que l'erreur apparaît dans le store
    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.error).toBe('Email ou mot de passe incorrect')
        expect(state.auth.isAuthenticated).toBe(false)
      },
      { timeout: 2000 },
    )
  })

  it('should show error when user does not exist', async () => {
    // Mock de l'API qui retourne une erreur 404
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: 'Email ou mot de passe incorrect' },
        status: 404,
      },
    }
    mockAuthApi.login.mockRejectedValue(axiosError)

    setup()

    const email = screen.getByPlaceholderText('Enter your email')
    const password = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(email, 'nonexistent@eventhub.com')
    await userEvent.type(password, 'Password123@')

    const form = email.closest('form')
    fireEvent.submit(form!)

    // Vérifier que l'erreur apparaît dans le store
    await waitFor(
      () => {
        const state = store.getState()
        expect(state.auth.error).toBe('Email ou mot de passe incorrect')
        expect(state.auth.isAuthenticated).toBe(false)
      },
      { timeout: 2000 },
    )
  })
})
