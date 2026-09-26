import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Calendar, Clock, MapPin, ArrowLeft, XCircle, CreditCard, CheckCircle2, X, MessageSquare } from 'lucide-react';
import StarRating from '../components/StarRating';

const MyBookings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(null);

    // Payment modal state
    const [paymentModal, setPaymentModal] = useState({ open: false, booking: null });
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    // Review modal state
    const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewedBookings, setReviewedBookings] = useState({});

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/bookings/user');
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

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setCancelLoading(bookingId);
            await api.patch('/bookings/cancel', { bookingId });
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelLoading(null);
        }
    };

    // Payment functions
    const openPaymentModal = (booking) => {
        setPaymentModal({ open: true, booking });
        setPaymentError('');
        setPaymentSuccess(null);
    };

    const closePaymentModal = () => {
        setPaymentModal({ open: false, booking: null });
        setPaymentError('');
        if (paymentSuccess) {
            setPaymentSuccess(null);
            fetchBookings();
        }
    };

    const handlePayment = async () => {
        setPaymentError('');
        setPaymentLoading(true);

        try {
            const { data } = await api.post('/payments', {
                bookingId: paymentModal.booking._id,
            });
            setPaymentSuccess(data);
        } catch (err) {
            setPaymentError(err.response?.data?.message || 'Payment failed');
        } finally {
            setPaymentLoading(false);
        }
    };

    // Review functions
    const openReviewModal = (booking) => {
        setReviewModal({ open: true, booking });
        setReviewForm({ rating: 0, comment: '' });
        setReviewError('');
        setReviewSuccess('');
    };

    const closeReviewModal = () => {
        setReviewModal({ open: false, booking: null });
        setReviewForm({ rating: 0, comment: '' });
        setReviewError('');
        if (reviewSuccess) {
            setReviewSuccess('');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) {
            setReviewError('Please select a rating');
            return;
        }

        setReviewError('');
        setReviewLoading(true);

        try {
            await api.post('/reviews', {
                bookingId: reviewModal.booking._id,
                serviceId: reviewModal.booking.serviceId._id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            setReviewSuccess('Review submitted successfully!');
            setReviewedBookings(prev => ({ ...prev, [reviewModal.booking._id]: true }));
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
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

    const getPaymentBadge = (paymentStatus) => {
        const styles = {
            UNPAID: 'bg-orange-100 text-orange-800 border-orange-200',
            PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[paymentStatus]}`}>
                {paymentStatus}
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
                                onClick={() => navigate('/services')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Browse Services
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
                        onClick={() => navigate('/services')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-500 mt-1">Track, manage, and pay for your service bookings</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Bookings */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">No bookings yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Browse services and make your first booking.</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                        >
                            Browse Services
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    {/* Left: Service Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {booking.serviceId?.serviceName || 'Service'}
                                            </h3>
                                            {getStatusBadge(booking.status)}
                                            {booking.status === 'CONFIRMED' && getPaymentBadge(booking.paymentStatus)}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4 text-indigo-500" />
                                                {formatDate(booking.date)}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                {formatTime(booking.time)}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4 text-indigo-500" />
                                                {booking.location}
                                            </div>
                                        </div>

                                        {/* Payment info if paid */}
                                        {booking.paymentStatus === 'PAID' && booking.paymentId && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit border border-emerald-100">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span className="font-medium">Paid</span>
                                                <span className="text-emerald-500">•</span>
                                                <span className="font-mono text-xs">{booking.paymentId}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Provider, Price & Actions */}
                                    <div className="flex flex-col items-end justify-between gap-2">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {booking.providerId?.name || 'Provider'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {booking.providerId?.email || ''}
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-indigo-600">
                                            ₹{booking.serviceId?.price || 'N/A'}
                                        </p>

                                        {/* Pay Now button — CONFIRMED + UNPAID only */}
                                        {booking.status === 'CONFIRMED' && booking.paymentStatus === 'UNPAID' && (
                                            <button
                                                onClick={() => openPaymentModal(booking)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all active:scale-95 mt-1"
                                            >
                                                <CreditCard className="h-3.5 w-3.5" />
                                                Pay Now
                                            </button>
                                        )}

                                        {/* Cancel button — only for PENDING bookings */}
                                        {booking.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancelLoading === booking._id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 mt-1"
                                            >
                                                {cancelLoading === booking._id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5" />
                                                )}
                                                Cancel Booking
                                            </button>
                                        )}

                                        {/* View Receipt link — PAID bookings */}
                                        {booking.paymentStatus === 'PAID' && (
                                            <button
                                                onClick={() => navigate(`/payment-success/${booking._id}`)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 mt-1"
                                            >
                                                View Receipt →
                                            </button>
                                        )}

                                        {/* Review Button — only for COMPLETED bookings */}
                                        {booking.status === 'COMPLETED' && !reviewedBookings[booking._id] && (
                                            <button
                                                onClick={() => openReviewModal(booking)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors mt-2"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                Leave Review
                                            </button>
                                        )}

                                        {booking.status === 'COMPLETED' && reviewedBookings[booking._id] && (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 mt-2">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Review Submitted
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Payment Confirmation Modal */}
            {paymentModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={closePaymentModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {!paymentSuccess ? (
                            <>
                                {/* Payment Confirmation */}
                                <div className="text-center mb-6">
                                    <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard className="h-7 w-7 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Confirm Payment</h2>
                                    <p className="text-gray-500 text-sm mt-1">Review the details below</p>
                                </div>

                                {/* Booking Summary */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-medium text-gray-900">
                                            {paymentModal.booking.serviceId?.serviceName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Provider</span>
                                        <span className="font-medium text-gray-900">
                                            {paymentModal.booking.providerId?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-medium text-gray-900">
                                            {formatDate(paymentModal.booking.date)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Time</span>
                                        <span className="font-medium text-gray-900">
                                            {formatTime(paymentModal.booking.time)}
                                        </span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                                        <span className="text-lg font-bold text-indigo-600">
                                            ₹{paymentModal.booking.serviceId?.price}
                                        </span>
                                    </div>
                                </div>

                                {paymentError && (
                                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                                        <p className="text-sm text-red-700 font-medium">{paymentError}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={closePaymentModal}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={paymentLoading}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {paymentLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CreditCard className="h-4 w-4" />
                                        )}
                                        {paymentLoading ? 'Processing...' : 'Pay Now'}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-3">
                                    This is a demo payment. No real charges will be made.
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Payment Success */}
                                <div className="text-center mb-6">
                                    <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
                                    <p className="text-gray-500 text-sm mt-1">Your booking payment has been processed</p>
                                </div>

                                <div className="bg-emerald-50 rounded-xl p-4 mb-6 space-y-3 border border-emerald-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Payment ID</span>
                                        <span className="font-mono font-semibold text-emerald-700 text-xs">
                                            {paymentSuccess.paymentId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-bold text-gray-900">
                                            ₹{paymentModal.booking.serviceId?.price}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-medium text-gray-900">
                                            {formatDateTime(paymentSuccess.paymentDate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        {getPaymentBadge('PAID')}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closePaymentModal}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            closePaymentModal();
                                            navigate(`/payment-success/${paymentModal.booking._id}`);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                                    >
                                        View Receipt
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* Review Modal */}
            {reviewModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={closeReviewModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {!reviewSuccess ? (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Leave a Review</h2>
                                <p className="text-sm text-gray-500 mb-6">
                                    Rate {reviewModal.booking?.serviceId?.serviceName || 'the service'}
                                </p>

                                {reviewError && (
                                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-700 font-medium">{reviewError}</p>
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Tap to rate</p>
                                        <StarRating
                                            rating={reviewForm.rating}
                                            setRating={(rating) => setReviewForm({ ...reviewForm, rating })}
                                            size="lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Comment (optional)
                                        </label>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            rows="3"
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                                            placeholder="Share your experience with this service..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeReviewModal}
                                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={reviewLoading}
                                            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center disabled:opacity-70"
                                        >
                                            {reviewLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                'Submit Review'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-sm text-gray-500 mb-6">{reviewSuccess}</p>
                                <button
                                    onClick={closeReviewModal}
                                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
