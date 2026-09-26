import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import StarRating from './StarRating';
import { Loader2, MessageSquareOff, User } from 'lucide-react';

const ServiceReviews = ({ serviceId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/reviews/${serviceId}`);
                setReviews(data);
            } catch (err) {
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchReviews();
        }
    }, [serviceId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-sm py-4">{error}</p>;
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : 0;

    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                Reviews
                {totalReviews > 0 && (
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        <StarRating rating={Math.round(averageRating)} readOnly={true} size="sm" />
                        <span className="font-bold text-gray-900">{averageRating}</span> ({totalReviews})
                    </span>
                )}
            </h4>

            {totalReviews === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100 flex flex-col items-center justify-center">
                    <MessageSquareOff className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No reviews yet.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User className="h-3 w-3 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{review.userId?.name || 'User'}</p>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <StarRating rating={review.rating} readOnly={true} size="sm" />
                            {review.comment && (
                                <p className="text-sm text-gray-600 mt-2 italic">"{review.comment}"</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c7c7cc;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1aa;
                }
            `}</style>
        </div>
    );
};

export default ServiceReviews;
