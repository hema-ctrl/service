import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import RegisterHero from '../assets/images/register_hero.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
        phone: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, role, phone } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                name,
                email,
                password,
                role,
                phone
            });

            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred during registration.');
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
                    src={RegisterHero}
                    alt="Register Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                    <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Join our community today</h2>
                        <p className="text-lg text-gray-800">
                            Create an account to start booking top-rated professionals or offering your own services.
                        </p>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/10 blur-2xl z-10"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl z-10"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-10 bg-white overflow-y-auto">
                <div className="w-full max-w-[420px] space-y-4">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-purple-100 text-purple-600 mb-3 lg:mb-4">
                            <span className="font-bold text-lg">S</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Create account
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Start your journey with us.
                        </p>
                    </div>

                    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                                <p className="text-xs text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">I am a...</label>
                                <div className="relative">
                                    <select
                                        id="role"
                                        name="role"
                                        required
                                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm appearance-none"
                                        value={role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">User (Book services)</option>
                                        <option value="PROVIDER">Provider (Offer services)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" class="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" class="block text-xs font-medium text-gray-700 mb-1">Confirm</label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide Passwords" : "Show Passwords"}
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 shadow-md shadow-indigo-200 transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                            <p className="mt-3 text-xs text-center text-gray-500">
                                By clicking "Create Account", you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                            </p>
                        </div>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
