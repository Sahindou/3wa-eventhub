import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectIsAuthenticated,
  selectIsInitializing,
} from '../../../authentification/store/authSelectors'
import {
  selectProfile,
  selectIsLoading,
  selectError,
  selectIsEditing,
  select2FASetup,
  select2FALoading,
  select2FAError,
  select2FAEnabled,
  selectRecoveryCodes,
} from '../../store/userSelectors'
import { startEditing, cancelEditing, clearError, clear2FASetup } from '../../store/userSlice'
import { updateUserProfile, setup2FA, verify2FA } from '../../store/userThunks'
import { logoutUser } from '../../../authentification/store/authThunks'
import type { AppDispatch } from '../../../../modules/store/store'

export const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isInitializing = useSelector(selectIsInitializing)
  const profile = useSelector(selectProfile)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const isEditing = useSelector(selectIsEditing)
  const twoFactorSetup = useSelector(select2FASetup)
  const is2FALoading = useSelector(select2FALoading)
  const twoFAError = useSelector(select2FAError)
  const is2FAEnabled = useSelector(select2FAEnabled)
  const recoveryCodes = useSelector(selectRecoveryCodes)

  console.log(twoFactorSetup)

  const [formData, setFormData] = useState({
    fristName: profile?.data?.fristName,
    email: profile?.data?.email,
  })

  const [show2FADialog, setShow2FADialog] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)

  // Synchroniser formData avec le profil
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fristName: profile?.data.fristName,
        email: profile?.data.email,
      })
    }
  }, [profile])

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  // Rediriger si non authentifié, uniquement après la fin de l'initialisation
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate('/login')
    }
  }, [isInitializing, isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEdit = () => {
    dispatch(startEditing())
  }

  const handleCancel = () => {
    dispatch(cancelEditing())
    // Réinitialiser le formulaire
    if (profile) {
      setFormData({
        fristName: profile.data.fristName,
        email: profile.data.email,
      })
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateUserProfile({ data: formData }))
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  const handleOpen2FADialog = () => {
    setShow2FADialog(true)
    setTwoFACode('')
    setShowSecret(false)
    dispatch(setup2FA())
  }

  const handleClose2FADialog = () => {
    setShow2FADialog(false)
    setTwoFACode('')
    setShowSecret(false)
    dispatch(clear2FASetup())
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
    const secret = twoFactorSetup?.data?.qrCode.secret
    if (twoFACode.trim() && secret) {
      dispatch(verify2FA(twoFACode.trim(), secret))
    }
  }

  const handleDownloadRecoveryCodes = () => {
    if (!recoveryCodes) return
    const content = recoveryCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codes-recuperation-2fa.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopySecret = () => {
    if (twoFactorSetup?.data?.qrCode.secret) {
      navigator.clipboard.writeText(twoFactorSetup.data.qrCode.secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-slate-600">Chargement du profil...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card du profil */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Mon Profil</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              Déconnexion
            </button>
          </div>

          {/* Avatar placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile?.data?.fristName}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* fristName */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                >
                  <circle strokeWidth="1.5" stroke="currentColor" r={4} cy={8} cx={12} />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
                  />
                </svg>
                <input
                  type="text"
                  name="fristName"
                  value={formData.fristName}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                >
                  <path
                    strokeWidth="1.5"
                    stroke="currentColor"
                    d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* ID (lecture seule) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID Utilisateur
              </label>
              <div className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg bg-gray-100 text-slate-600 flex items-center font-mono">
                {profile?.data.id}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 h-12 bg-blue-500 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  Modifier
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gray-200 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-blue-500 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Section double authentification */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Double authentification</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {is2FAEnabled ? 'Activée' : 'Désactivée'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpen2FADialog}
                disabled={is2FAEnabled}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  is2FAEnabled
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0'
                }`}
              >
                {is2FAEnabled ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path
                        strokeWidth="2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Activée
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path
                        strokeWidth="1.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Activer
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-slate-500">
              Membre depuis {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Dialog 2FA */}
      {show2FADialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose2FADialog}
          />

          {/* Contenu du dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 z-10">
            {/* Header dialog */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Activer la 2FA</h2>
              <button
                onClick={handleClose2FADialog}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Erreur 2FA */}
            {twoFAError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {twoFAError}
              </div>
            )}

            {/* Succès + codes de récupération */}
            {is2FAEnabled ? (
              <div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24">
                      <path
                        strokeWidth="2.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    Double authentification activée !
                  </p>
                </div>

                {recoveryCodes && recoveryCodes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-1">Codes de récupération</p>
                    <p className="text-xs text-slate-500 mb-3">
                      Conservez ces codes en lieu sûr. Ils vous permettront d'accéder à votre compte
                      si vous perdez votre application d'authentification. Chaque code n'est
                      utilisable qu'une seule fois.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 p-3 bg-slate-50 border border-gray-200 rounded-lg mb-3">
                      {recoveryCodes.map((code) => (
                        <code
                          key={code}
                          className="text-xs font-mono text-slate-700 bg-white border border-gray-200 rounded px-2 py-1 text-center tracking-wider"
                        >
                          {code}
                        </code>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadRecoveryCodes}
                      className="w-full flex items-center justify-center gap-2 h-10 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <path
                          strokeWidth="1.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Télécharger (.txt)
                    </button>
                  </div>
                )}

                <button
                  onClick={handleClose2FADialog}
                  className="w-full h-10 bg-gray-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                {/* Chargement du QR code */}
                {is2FALoading && !twoFactorSetup ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Génération du QR code...</p>
                  </div>
                ) : twoFactorSetup ? (
                  <>
                    {/* Étape 1 : QR code */}
                    <div className="mb-5">
                      <p className="text-sm text-slate-600 mb-3">
                        Scannez ce QR code avec votre application d'authentification (Google
                        Authenticator, Authy…)
                      </p>
                      <div className="flex justify-center p-4 bg-slate-50 rounded-xl border border-gray-200">
                        <img
                          src={twoFactorSetup.data.qrCode.image}
                          alt="QR Code 2FA"
                          className="w-44 h-44 object-contain"
                        />
                      </div>
                    </div>

                    {/* Clé secrète manuelle */}
                    <div className="mb-5">
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <path
                            strokeWidth="1.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            d={
                              showSecret
                                ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                                : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            }
                          />
                        </svg>
                        {showSecret ? 'Masquer' : 'Afficher'} la clé manuelle
                      </button>

                      {showSecret && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <code className="flex-1 text-xs font-mono text-amber-800 break-all select-all">
                            {twoFactorSetup.data.qrCode.secret}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            title="Copier"
                            className="shrink-0 p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                          >
                            {copied ? (
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeWidth="2.5"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <path
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Étape 2 : saisie du code */}
                    <form onSubmit={handleVerify2FA}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Code de vérification
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-12 px-4 text-center text-xl font-mono tracking-widest border border-gray-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        disabled={is2FALoading || twoFACode.length !== 6}
                        className="mt-3 w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {is2FALoading ? 'Vérification...' : 'Activer la 2FA'}
                      </button>
                    </form>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
