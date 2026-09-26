import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, Clock, IndianRupee, Tag, User, AlertCircle, Search, X, MapPin, Calendar, CalendarClock } from 'lucide-react';
import ServiceReviews from '../components/ServiceReviews';

const ServiceListing = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Booking modal state
    const [bookingModal, setBookingModal] = useState({ open: false, service: null });
    const [bookingForm, setBookingForm] = useState({ date: '', time: '', location: '' });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/services');
            setServices(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Booking functions
    const openBookingModal = (service) => {
        setBookingModal({ open: true, service });
        setBookingForm({ date: '', time: '', location: '' });
        setBookingError('');
        setBookingSuccess('');
    };

    const closeBookingModal = () => {
        setBookingModal({ open: false, service: null });
        setBookingForm({ date: '', time: '', location: '' });
        setBookingError('');
        setBookingSuccess('');
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingError('');
        setBookingSuccess('');
        setBookingLoading(true);

        try {
            await api.post('/bookings', {
                serviceId: bookingModal.service._id,
                date: bookingForm.date,
                time: bookingForm.time,
                location: bookingForm.location,
            });
            setBookingSuccess('Booking request submitted successfully! The provider will review your request.');
            setBookingForm({ date: '', time: '', location: '' });
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    // Filter services by search query
    const filteredServices = services.filter(
        (service) =>
            service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get unique categories
    const categories = [...new Set(services.map((s) => s.category))];

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

            {/* Booking Modal */}
            {bookingModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                        <button
                            onClick={closeBookingModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">Book Service</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {bookingModal.service?.serviceName} — ₹{bookingModal.service?.price}
                        </p>

                        {bookingSuccess && (
                            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
                                <p className="text-xs text-green-700 font-medium">{bookingSuccess}</p>
                            </div>
                        )}

                        {bookingError && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                                <p className="text-xs text-red-700 font-medium">{bookingError}</p>
                            </div>
                        )}

                        {!bookingSuccess && (
                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <Calendar className="h-3 w-3 inline mr-1" />
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            min={today}
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            value={bookingForm.date}
                                            onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <CalendarClock className="h-3 w-3 inline mr-1" />
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            value={bookingForm.time}
                                            onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        <MapPin className="h-3 w-3 inline mr-1" />
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                        placeholder="e.g. 123 Main St, City"
                                        value={bookingForm.location}
                                        onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                                    />
                                </div>

                                {/* Service Summary */}
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Booking Summary</p>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-900 font-medium">{bookingModal.service?.serviceName}</p>
                                        <p className="text-gray-500">Provider: {bookingModal.service?.providerId?.name || 'N/A'}</p>
                                        <p className="text-gray-500">Duration: {bookingModal.service?.duration}</p>
                                        <p className="text-indigo-600 font-bold">₹{bookingModal.service?.price}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeBookingModal}
                                        className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="flex-1 flex justify-center items-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:bg-indigo-400"
                                    >
                                        {bookingLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            'Confirm Booking'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {bookingSuccess && (
                            <div className="flex gap-3">
                                <button
                                    onClick={closeBookingModal}
                                    className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => navigate('/my-bookings')}
                                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
                                >
                                    View My Bookings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Find the perfect <span className="text-indigo-600">service</span>
                        </h1>
                        <p className="text-gray-500 max-w-2xl text-lg mb-6">
                            Browse our curated list of professional services from verified providers.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services by name, category, or description..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Pills */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchQuery(cat)}
                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                        {cat}
                                    </button>
                                ))}
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                                    >
                                        Clear filter
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Service Cards Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">No services found</h3>
                        <p className="text-gray-500 text-sm">
                            {searchQuery
                                ? 'Try adjusting your search query.'
                                : 'No services are available at the moment. Check back later!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <div
                                    key={service._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col"
                                >
                                    {/* Category Tag */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                                            <Tag className="h-3 w-3" />
                                            {service.category}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(service.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Service Info */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {service.serviceName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Price & Duration */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                                            <IndianRupee className="h-4 w-4 text-green-600" />
                                            {service.price}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            {service.duration}
                                        </div>
                                    </div>

                                    {/* Provider Info */}
                                    <div className="pt-4 border-t border-gray-100 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {service.providerId?.name || 'Unknown Provider'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {service.providerId?.email || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Now Button */}
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => openBookingModal(service)}
                                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                                        >
                                            Book Now
                                        </button>
                                    </div>

                                    {/* Reviews Section */}
                                    <ServiceReviews serviceId={service._id} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ServiceListing;
