import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating, readOnly = false, size = 'md' }) => {
    const [hover, setHover] = useState(null);

    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const iconSize = sizes[size] || sizes.md;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                    <button
                        type="button"
                        key={index}
                        disabled={readOnly}
                        className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} focus:outline-none`}
                        onClick={() => !readOnly && setRating(currentRating)}
                        onMouseEnter={() => !readOnly && setHover(currentRating)}
                        onMouseLeave={() => !readOnly && setHover(null)}
                    >
                        <Star
                            className={`${iconSize} ${currentRating <= (hover || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
