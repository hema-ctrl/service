import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, X, Filter, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [actionLoading, setActionLoading] = useState(null); // service ID being processed
    const [rejectModal, setRejectModal] = useState({ open: false, serviceId: null });
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/services');
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

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            await api.patch(`/admin/services/${id}/approve`);
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve service');
        } finally {
            setActionLoading(null);
        }
    };

    const openRejectModal = (id) => {
        setRejectModal({ open: true, serviceId: id });
        setRejectionReason('');
    };

    const handleReject = async () => {
        try {
            setActionLoading(rejectModal.serviceId);
            await api.patch(`/admin/services/${rejectModal.serviceId}/reject`, {
                rejectionReason,
            });
            setRejectModal({ open: false, serviceId: null });
            setRejectionReason('');
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject service');
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
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const filteredServices =
        statusFilter === 'ALL'
            ? services
            : services.filter((s) => s.approvalStatus === statusFilter);

    // Stats
    const stats = {
        total: services.length,
        pending: services.filter((s) => s.approvalStatus === 'PENDING').length,
        approved: services.filter((s) => s.approvalStatus === 'APPROVED').length,
        rejected: services.filter((s) => s.approvalStatus === 'REJECTED').length,
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
                                onClick={() => navigate('/admin/bookings')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Bookings
                            </button>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Users
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                    <p className="text-gray-500 mt-1">Review and manage service submissions</p>
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
                        <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Approved</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Rejected</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">{stats.rejected}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Filter */}
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Filter:</span>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
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

                {/* Reject Modal */}
                {rejectModal.open && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                            <button
                                onClick={() => setRejectModal({ open: false, serviceId: null })}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="text-xl font-bold text-gray-900 mb-2">Reject Service</h2>
                            <p className="text-sm text-gray-500 mb-4">Optionally provide a reason for rejection.</p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none mb-4"
                                placeholder="Reason for rejection (optional)..."
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRejectModal({ open: false, serviceId: null })}
                                    className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading === rejectModal.serviceId}
                                    className="flex-1 flex justify-center items-center py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:bg-red-400"
                                >
                                    {actionLoading === rejectModal.serviceId ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        'Reject Service'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services Table */}
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
                            {statusFilter === 'ALL' ? 'No services have been submitted yet.' : `No ${statusFilter.toLowerCase()} services.`}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredServices.map((service) => (
                                        <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{service.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{service.providerId?.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{service.providerId?.email || ''}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{service.category}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{service.price}</td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(service.approvalStatus)}
                                                {service.approvalStatus === 'REJECTED' && service.rejectionReason && (
                                                    <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={service.rejectionReason}>
                                                        {service.rejectionReason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {service.approvalStatus !== 'APPROVED' && (
                                                        <button
                                                            onClick={() => handleApprove(service._id)}
                                                            disabled={actionLoading === service._id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            {actionLoading === service._id ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Check className="h-3.5 w-3.5" />
                                                            )}
                                                            Approve
                                                        </button>
                                                    )}
                                                    {service.approvalStatus !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => openRejectModal(service._id)}
                                                            disabled={actionLoading === service._id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            Reject
                                                        </button>
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

export default AdminDashboard;
