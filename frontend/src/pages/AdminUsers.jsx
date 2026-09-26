import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Users, ShieldCheck, Wrench } from 'lucide-react';

const AdminUsers = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleBadge = (role) => {
        const styles = {
            USER: 'bg-blue-100 text-blue-800 border-blue-200',
            PROVIDER: 'bg-purple-100 text-purple-800 border-purple-200',
            ADMIN: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[role]}`}>
                {role}
            </span>
        );
    };

    const filteredUsers =
        roleFilter === 'ALL'
            ? users
            : users.filter((u) => u.role === roleFilter);

    // Stats
    const stats = {
        total: users.length,
        users: users.filter((u) => u.role === 'USER').length,
        providers: users.filter((u) => u.role === 'PROVIDER').length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3">
                                    <span className="text-white font-bold">S</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    ServiceBook
                                </span>
                            </div>
                            <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                ADMIN
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => navigate('/admin/bookings')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Bookings
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium border border-indigo-100 hidden sm:flex">
                                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                {user?.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Monitor all registered users on the platform</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-blue-400" />
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Users</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{stats.users}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Wrench className="h-4 w-4 text-purple-400" />
                            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Providers</p>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{stats.providers}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="h-4 w-4 text-red-400" />
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Admins</p>
                        </div>
                        <p className="text-2xl font-bold text-red-700">{stats.admins}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Filter */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="text-sm font-medium text-gray-600">Role:</span>
                    {['ALL', 'USER', 'PROVIDER', 'ADMIN'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${roleFilter === r
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">No users found</h3>
                        <p className="text-gray-500 text-sm">
                            {roleFilter === 'ALL' ? 'No users registered yet.' : `No ${roleFilter.toLowerCase()} users.`}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.phone || '—'}</td>
                                            <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminUsers;
