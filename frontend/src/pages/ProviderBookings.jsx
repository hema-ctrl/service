import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, X, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ProviderBookings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/bookings/provider');
            setBookings(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (bookingId, status) => {
        try {
            setActionLoading(bookingId);
            await api.patch('/bookings/status', { bookingId, status });
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update booking');
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200',
            COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
            CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const formatTime = (timeStr) => {
        try {
            const [h, m] = timeStr.split(':');
            const hour = parseInt(h, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m} ${ampm}`;
        } catch {
            return timeStr;
        }
    };

    const filteredBookings =
        statusFilter === 'ALL'
            ? bookings
            : bookings.filter((b) => b.status === statusFilter);

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === 'PENDING').length,
        confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
        completed: bookings.filter((b) => b.status === 'COMPLETED').length,
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
                            <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                                PROVIDER
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/provider/dashboard')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                My Services
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
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/provider/dashboard')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
                        <p className="text-gray-500 mt-1">Manage incoming booking requests</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-yellow-100 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Confirmed</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Completed</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">{stats.completed}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Filter */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="text-sm font-medium text-gray-600">Filter:</span>
                    {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${statusFilter === status
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Bookings Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">No booking requests</h3>
                        <p className="text-gray-500 text-sm">
                            {statusFilter === 'ALL'
                                ? 'No booking requests yet.'
                                : `No ${statusFilter.toLowerCase()} bookings.`}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.userId?.name || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {booking.userId?.email || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.serviceId?.serviceName || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ₹{booking.serviceId?.price || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                                                <div className="text-xs text-gray-500">{formatTime(booking.time)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {booking.location}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* PENDING → CONFIRMED or REJECTED */}
                                                    {booking.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(booking._id, 'CONFIRMED')}
                                                                disabled={actionLoading === booking._id}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === booking._id ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <Check className="h-3.5 w-3.5" />
                                                                )}
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(booking._id, 'REJECTED')}
                                                                disabled={actionLoading === booking._id}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {/* CONFIRMED → COMPLETED */}
                                                    {booking.status === 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => updateStatus(booking._id, 'COMPLETED')}
                                                            disabled={actionLoading === booking._id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === booking._id ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                            )}
                                                            Complete
                                                        </button>
                                                    )}
                                                    {/* REJECTED / COMPLETED — no actions */}
                                                    {(booking.status === 'REJECTED' || booking.status === 'COMPLETED') && (
                                                        <span className="text-xs text-gray-400 italic">No actions</span>
                                                    )}
                                                </div>
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

export default ProviderBookings;
