import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProviderDashboard from '../pages/ProviderDashboard';
import ProviderBookings from '../pages/ProviderBookings';
import AdminDashboard from '../pages/AdminDashboard';
import AdminBookings from '../pages/AdminBookings';
import AdminUsers from '../pages/AdminUsers';
import ServiceListing from '../pages/ServiceListing';
import MyBookings from '../pages/MyBookings';
import PaymentSuccess from '../pages/PaymentSuccess';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
    const { user } = useAuth();

    // Role-based redirect after login
    const HomeRedirect = () => {
        if (!user) return <Navigate to="/login" replace />;

        switch (user.role) {
            case 'PROVIDER':
                return <Navigate to="/provider/dashboard" replace />;
            case 'ADMIN':
                return <Navigate to="/admin/dashboard" replace />;
            default:
                return <Navigate to="/dashboard" replace />;
        }
    };

    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* USER Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services" element={<ServiceListing />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/payment-success/:bookingId" element={<PaymentSuccess />} />
            </Route>

            {/* PROVIDER Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/provider/bookings" element={<ProviderBookings />} />
            </Route>

            {/* ADMIN Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
