import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, ArrowRight, Lock, User, ArrowLeft, Mail } from 'lucide-react'

type ViewState = 'login' | 'signup' | 'forgot'

export default function Login({ onLogin }: { onLogin: () => void }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState<ViewState>('login')

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    // Form fields
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleSwitchView = (newView: ViewState) => {
        setView(newView)
        setError('')
        setSuccessMsg('')
        setUsername('')
        setPassword('')
        setEmail('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMsg('')
        setLoading(true)

        try {
            if (view === 'login') {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })

                const data = await response.json()

                if (response.ok) {
                    onLogin()
                    navigate('/dashboard')
                } else {
                    setError(data.error || 'Invalid email or password.')
                    setLoading(false)
                }
            } else if (view === 'signup') {
                const response = await fetch(`${API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: username, email, password })
                })

                const data = await response.json()

                if (response.ok) {
                    setSuccessMsg('Account created successfully! Please sign in.')
                    setTimeout(() => {
                        handleSwitchView('login')
                        setLoading(false)
                    }, 2000)
                } else {
                    setError(data.error || 'Registration failed.')
                    setLoading(false)
                }
            } else if (view === 'forgot') {
                // Simulate sending reset link for now
                setSuccessMsg('A password reset link has been sent to your email.')
                setTimeout(() => {
                    handleSwitchView('login')
                    setLoading(false)
                }, 2000)
            }
        } catch (err) {
            setError('Could not connect to the server. Is it running?')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amul-lightblue flex items-center justify-center p-4 relative overflow-hidden">

            {/* Decorative background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-amul-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-white relative transition-all duration-500">

                {/* Back button for secondary views */}
                {view !== 'login' && (
                    <button
                        onClick={() => handleSwitchView('login')}
                        className="absolute top-4 left-4 z-20 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Header Area */}
                <div className="bg-amul-darkblue p-8 text-center relative overflow-hidden transition-all duration-500" style={{ paddingBottom: view === 'login' ? '2rem' : '1.5rem' }}>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                    <div className={`mx-auto flex items-center justify-center shadow-lg transform transition-all duration-500 relative z-10 border-4 border-white bg-amul-yellow
                        ${view === 'login' ? 'w-20 h-20 rounded-2xl rotate-3 hover:rotate-6' : 'w-16 h-16 rounded-full rotate-0'}
                    `}>
                        <Store className={`${view === 'login' ? 'w-10 h-10' : 'w-8 h-8'} text-amul-darkblue transition-all`} />
                    </div>

                    <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight relative z-10">
                        {view === 'login' && 'Amul Shop'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                    </h2>
                    <p className="mt-1 text-blue-200 font-medium relative z-10 text-sm">
                        {view === 'login' && 'Secure Management System'}
                        {view === 'signup' && 'Join the distribution network'}
                        {view === 'forgot' && 'We\'ll send you recovery instructions'}
                    </p>
                </div>

                {/* Form Area */}
                <div className="p-8">
                    <form className="space-y-5 animate-in fade-in zoom-in-95 duration-300" onSubmit={handleSubmit} key={view}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-in slide-in-from-top-2">
                                <p className="text-sm font-bold text-red-700">{error}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl animate-in slide-in-from-top-2">
                                <p className="text-sm font-bold text-emerald-700">{successMsg}</p>
                            </div>
                        )}

                        {/* Username Field (Signup Only) */}
                        {view === 'signup' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="name"
                                        required
                                        placeholder="Full Name"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-all text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field (Login, Signup & Forgot Password) */}
                        <div className="animate-in slide-in-from-top-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    placeholder="your@email.com"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Field (Login & Signup) */}
                        {(view === 'login' || view === 'signup') && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                                        required
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-all text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Remember & Forgot Password Links (Login Only) */}
                        {view === 'login' && (
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center">
                                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-amul-darkblue focus:ring-amul-darkblue border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">Remember me</label>
                                </div>
                                <button type="button" onClick={() => handleSwitchView('forgot')} className="text-sm font-bold text-amul-darkblue hover:text-blue-800 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading ||
                                (view === 'login' && (!email || !password)) ||
                                (view === 'signup' && (!username || !email || !password)) ||
                                (view === 'forgot' && !email)
                            }
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-extrabold text-white bg-amul-darkblue hover:bg-blue-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amul-darkblue active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {view === 'login' && 'Sign In to Dashboard'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'forgot' && 'Send Reset Link'}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-4 text-sm">
                        {view === 'login' && (
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <button onClick={() => handleSwitchView('signup')} className="font-bold text-amul-darkblue hover:text-blue-800 transition-colors">
                                    Sign up now
                                </button>
                            </p>
                        )}

                        <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
                            <span>Powered by</span>
                            <span className="font-bold text-gray-600">Antigravity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
