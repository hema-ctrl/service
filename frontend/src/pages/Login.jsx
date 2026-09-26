import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import LoginHero from '../assets/images/login_hero.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Hero Image (Hidden on mobile) */}
            {/* Left Side - Hero Image (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-50">
                <img
                    src={LoginHero}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                    <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Connect with expert service providers</h2>
                        <p className="text-lg text-gray-800">
                            Experience the easiest way to book services. Secure, fast, and reliable.
                        </p>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/10 blur-3xl z-10"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl z-10"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
                <div className="w-full max-w-[420px] space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-6 lg:mb-8">
                            <span className="font-bold text-xl">S</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:text-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors sm:text-sm pr-12"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-indigo-600 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Register now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
