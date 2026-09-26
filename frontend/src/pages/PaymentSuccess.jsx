import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, Calendar, Clock, MapPin, CreditCard, ArrowLeft, Printer } from 'lucide-react';

const PaymentSuccess = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPaymentDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/payments/${bookingId}`);
            setPaymentData(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payment details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentDetails();
    }, [bookingId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    const formatDateTime = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return dateStr;
        }
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
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                My Bookings
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
            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Bookings
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">Error loading payment</h3>
                        <p className="text-gray-500 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                        >
                            Go to Bookings
                        </button>
                    </div>
                ) : paymentData ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-8 text-center">
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Payment Successful</h1>
                            <p className="text-emerald-100 text-sm mt-1">Your payment has been processed</p>
                        </div>

                        {/* Payment Details */}
                        <div className="p-6">
                            {/* Payment ID Card */}
                            <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100 text-center">
                                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Payment ID</p>
                                <p className="font-mono text-lg font-bold text-emerald-700">{paymentData.paymentId}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <CreditCard className="h-4 w-4" />
                                        Payment Status
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                        {paymentData.paymentStatus}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        Payment Date
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDateTime(paymentData.paymentDate)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Service</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {paymentData.booking?.serviceId?.serviceName}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Provider</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {paymentData.booking?.providerId?.name}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        Booking Date
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDate(paymentData.booking?.date)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Clock className="h-4 w-4" />
                                        Time
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatTime(paymentData.booking?.time)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        Location
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {paymentData.booking?.location}
                                    </span>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 bg-gray-50 -mx-6 px-6 mt-4 rounded-b-xl">
                                    <span className="text-base font-semibold text-gray-700">Total Amount Paid</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{paymentData.booking?.serviceId?.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                My Bookings
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                <Printer className="h-4 w-4" />
                                Print Receipt
                            </button>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default PaymentSuccess;
