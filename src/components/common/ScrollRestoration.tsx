import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollRestoration() {
    const location = useLocation();

    useEffect(() => {
        // Don't scroll to top on navigation
        // This prevents the automatic scroll-to-top behavior
        // Users can manually scroll using the scrollbar
        return () => {
            // Cleanup if needed
        };
    }, [location.pathname]);

    return null;
}
