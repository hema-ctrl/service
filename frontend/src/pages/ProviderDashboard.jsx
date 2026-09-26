import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

const ProviderDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        serviceName: '',
        category: '',
        description: '',
        price: '',
        duration: '',
    });

    // Fetch provider's services
    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/services/provider');
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

    const resetForm = () => {
        setFormData({
            serviceName: '',
            category: '',
            description: '',
            price: '',
            duration: '',
        });
        setEditingService(null);
        setFormError('');
        setShowForm(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Create or Update service
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            if (editingService) {
                await api.put(`/services/${editingService._id}`, {
                    ...formData,
                    price: Number(formData.price),
                });
            } else {
                await api.post('/services', {
                    ...formData,
                    price: Number(formData.price),
                });
            }
            resetForm();
            fetchServices();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    // Edit service
    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            serviceName: service.serviceName,
            category: service.category,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration,
        });
        setShowForm(true);
    };

    // Delete service
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await api.delete(`/services/${id}`);
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete service');
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
                                onClick={() => navigate('/provider/bookings')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:block"
                            >
                                Booking Requests
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
                        <p className="text-gray-500 mt-1">Manage your service offerings</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Add Service
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                            <button
                                onClick={resetForm}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>

                            {formError && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                                    <p className="text-xs text-red-700 font-medium">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Service Name</label>
                                        <input
                                            name="serviceName"
                                            type="text"
                                            required
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            placeholder="e.g. Home Cleaning"
                                            value={formData.serviceName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            name="category"
                                            type="text"
                                            required
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            placeholder="e.g. Cleaning"
                                            value={formData.category}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={3}
                                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                                        placeholder="Describe your service..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            required
                                            min="0"
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            placeholder="e.g. 500"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                                        <input
                                            name="duration"
                                            type="text"
                                            required
                                            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            placeholder="e.g. 2 hours"
                                            value={formData.duration}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 flex justify-center items-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:bg-indigo-400"
                                    >
                                        {formLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : editingService ? (
                                            'Update Service'
                                        ) : (
                                            'Create Service'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Services Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : services.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-1">No services yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Start by adding your first service offering.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Add Your First Service
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {services.map((service) => (
                                        <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{service.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{service.category}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{service.price}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{service.duration}</td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(service.approvalStatus)}
                                                {service.approvalStatus === 'REJECTED' && service.rejectionReason && (
                                                    <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={service.rejectionReason}>
                                                        Reason: {service.rejectionReason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
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

export default ProviderDashboard;
