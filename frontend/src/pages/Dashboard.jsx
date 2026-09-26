import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium border border-indigo-100 hidden sm:flex">
                                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                {user?.email}
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
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, <span className="text-indigo-600">{user?.name || 'User'}</span>!
                        </h1>
                        <p className="text-gray-500 max-w-2xl text-lg">
                            Manage your bookings and services from your personal dashboard.
                        </p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                                <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</label>
                                <p className="text-gray-900 font-medium capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</label>
                                <p className="text-gray-900 font-medium">Just now</p>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder Card 1: Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center min-h-[240px]">
                        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">No Recent Activity</h3>
                        <p className="text-sm text-gray-500">Your recent bookings will appear here.</p>
                        <button onClick={() => navigate('/services')} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Browse Services &rarr;
                        </button>
                    </div>

                    {/* Placeholder Card 2: Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center min-h-[240px]">
                        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">Quick Actions</h3>
                        <p className="text-sm text-gray-500 mb-4">What would you like to do today?</p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                                onClick={() => navigate('/services')}
                                className="px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                Book Service
                            </button>
                            <button className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
